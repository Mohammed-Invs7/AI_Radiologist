from datetime import timedelta, datetime,time
import os
from django.utils import timezone
from django.db.models import Count
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import F
from users.permissions import IsAdminUser
from reports.models import Report
from ai_models.models import AIModel
from users.models import UserType

from .serializers import (
    DashboardSummarySerializer,
    TrendSerializer,
    RecentUserSerializer,
    RecentReportSerializer,
    ModelUsageSerializer
)

User = get_user_model()


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="Dashboard Summary",
        description=(
            "Get high-level counts for users, reports, and AI models. "
            "Breakdowns by type and modality are included."
        ),
        responses={200: DashboardSummarySerializer}
    )
    def get(self, request):
        total_users    = User.objects.count()
        active_users   = User.objects.filter(is_active=True).count()
        inactive_users = total_users - active_users
        users_by_type  = (
            UserType.objects
                    .annotate(count=Count('user'))
                    .values('name', 'count')
        )

        total_reports = Report.objects.count()

        today_local = timezone.localtime(timezone.now()).date()

        start_of_day = datetime.combine(today_local, time.min)
        start = timezone.make_aware(start_of_day, timezone.get_current_timezone())
        end = start + timedelta(days=1)
        reports_today = Report.objects.filter(
            report_date__gte=start,
            report_date__lt=end
        ).count()
        reports_by_modality = (
            Report.objects
            .values(modality=F('model__radio_detail__radio_mod__name'))
            .annotate(count=Count('id'))
        )

        total_models  = AIModel.objects.count()
        active_models = AIModel.objects.filter(active_status=True).count()

        payload = {
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'users_by_type': list(users_by_type),
            'total_reports': total_reports,
            'reports_today': reports_today,
            'reports_by_modality': list(reports_by_modality),
            'total_models': total_models,
            'active_models': active_models,
        }
        return Response(payload)


class UserTrendView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="User Sign-Up Trend",
        description="Daily count of new user registrations over the past N days.",
        parameters=[
            OpenApiParameter(name="days", description="Number of days to look back", required=False, type=int)
        ],
        responses={200: TrendSerializer}
    )
    def get(self, request):
        days = int(request.query_params.get('days', 30))

        # Compute “today” in local time, and build a list of dates
        today_local = timezone.localtime(timezone.now()).date()
        dates = [
            today_local - timedelta(days=i)
            for i in range(days-1, -1, -1)
        ]

        # Build the labels (ISO strings) once
        labels = [d.isoformat() for d in dates]

        # For each date, count users whose join_date (UTC) falls into that local day
        data = []
        for d in dates:
            # start = d at 00:00 local
            start_local = datetime.combine(d, time.min)
            # make it timezone-aware in your local zone
            start = timezone.make_aware(start_local, timezone.get_current_timezone())
            # end = next day at 00:00 local
            end = start + timedelta(days=1)

            count = User.objects.filter(
                join_date__gte=start,
                join_date__lt=end
            ).count()
            data.append(count)

        return Response({'labels': labels, 'data': data})
class ReportTrendView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="Report Creation Trend",
        description="Daily count of new reports over the past N days.",
        parameters=[
            OpenApiParameter(name="days", description="Number of days to look back", required=False, type=int)
        ],
        responses={200: TrendSerializer}
    )
    def get(self, request):
        days = int(request.query_params.get('days', 30))

        today_local = timezone.localtime(timezone.now()).date()
        dates = [today_local - timedelta(days=i) for i in range(days-1, -1, -1)]

        labels = [d.isoformat() for d in dates]


        data = []
        for d in dates:
            start = timezone.make_aware(timezone.datetime.combine(d, timezone.datetime.min.time()))
            end   = start + timedelta(days=1)
            count = Report.objects.filter(report_date__gte=start, report_date__lt=end).count()
            data.append(count)

        return Response({'labels': labels, 'data': data})


class RecentUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="Recent Users",
        description="List the most recently joined users, default limit 10.",
        parameters=[
            OpenApiParameter(name="limit", description="Max users to return", required=False, type=int)
        ],
        responses={200: RecentUserSerializer(many=True)}
    )
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        qs = User.objects.order_by('-join_date')[:limit]
        users = list(qs.values(
            'id', 'email', 'first_name', 'last_name', 'join_date', 'user_type__name'
        ))
        for u in users:
            u['user_type'] = u.pop('user_type__name')
        return Response(users)


class RecentReportsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="Recent Reports",
        description="List the most recent reports, default limit 10.",
        parameters=[
            OpenApiParameter(name="limit", description="Max reports to return", required=False, type=int)
        ],
        responses={200: RecentReportSerializer(many=True)}
    )
    def get(self, request):
        limit = int(request.query_params.get('limit', 10))
        qs = Report.objects.order_by('-report_date').values(
            'id',
            'user__email',
            'user__first_name',
            'user__last_name',
            'model__radio_detail__radio_mod__name',
            'report_date'
        )[:limit]

        reps = []
        for r in qs:
            reps.append({
                'id':        r['id'],
                'user':      r['user__email'],
                'full_name': f"{r['user__first_name']} {r['user__last_name']}",
                'modality':  r['model__radio_detail__radio_mod__name'],
                'date':      r['report_date'],
            })

        return Response(reps)


class ModelsListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(
        summary="AI Models Usage",
        description="List all AI models along with how many reports use each.",
        responses={200: ModelUsageSerializer(many=True)}
    )
    def get(self, request):
        ms = (
            AIModel.objects
                   .annotate(usage_count=Count('reports'))
                   .values('id', 'name', 'active_status', 'usage_count')
        )
        return Response(list(ms))
