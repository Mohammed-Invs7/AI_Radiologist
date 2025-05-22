import re
from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def bold_headings(value):
    """
    Wrap any line-starting 'Title:' (up to the colon) in <strong>…</strong>.
    """
    def repl(m):
        # m.group('h') is e.g. 'Findings:'
        return f"<strong>{m.group('h')}</strong>"
    # (?m) = multiline, ^ anchors to start of each line
    new = re.sub(r'(?m)^(?P<h>[^:\n]+:)', repl, value)
    return mark_safe(new)