import React, { useState } from 'react';
import { Container, InputGroup, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineCalendar } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image5 from "../assets/Vector.png";
import NavBar from './NavBar';
import RadiologyImages from './RadiologyImages';

const Profile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <NavBar />
      <Container className='mt-3'
        style={{
          background: 'linear-gradient(90deg, rgba(2, 85, 89, 0.90) 0%, #80DFDF 66%)',
          width: '900px',
          height: '180px'
        }}>
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '44%',
          right: '66%',
          textAlign: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '50%',
            width: '70px',
            height: '70px',
            display: 'flex',        // ✅ يجعل الصورة في المنتصف أفقيًا ورأسيًا
            alignItems: 'center',   // ✅ محاذاة الصورة عموديًا
            justifyContent: 'center', // ✅ محاذاة الصورة أفقيًا
            border: '1px solid black',
            marginRight: '10px'
          }}>
            <img style={{
              width: '50px',
              height: '55px',
              objectFit: 'contain' // ✅ يضمن أن الصورة لا تخرج عن الدائرة
            }} src={Image5} alt="" />
          </div>
          <h5 className='mt-3'>Ali Bin Shamlan</h5>
        </div>
      </Container>

      {/* Search Input & Date Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '70px', justifyContent: 'center' }}>
        {/* Search Input with Icon */}
        <InputGroup className="mb-2" style={{ width: '400px' }}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '35px' }} // لضبط الأيقونة داخل الحقل
          />
          <InputGroup.Text style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>

        {/* Date Picker Icon */}
        <Button style={{ background:'#fff', color:"black", border:'none', padding: '5px 5px', display: 'flex', alignItems: 'center' }}>
          <AiOutlineCalendar size={30} />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select a date"
            className="form-control"
            customInput={<div style={{ width: 0, height: 0, overflow: 'hidden' }} />} // إخفاء حقل التقويم الافتراضي
          />
        </Button>
      </div>

      {/* Radiology Images Section */}
      <RadiologyImages /> {/* إضافة مكون RadiologyImages هنا */}
    </div>
  );
};

export default Profile;
