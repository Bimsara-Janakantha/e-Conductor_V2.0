import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';


const credits = 500;

const rows = [
  {
    id: 'TOP123456',
    date: '2025\u00a0June\u00a008',
    time: '09:07',
    description: 'Online\u00a0Top-Up',
    amount: '500.00',
  },{
    id:'REF123456',
    date: '2025\u00a0May\u00a008',
    time: '09:07',
    description: 'Refund\u00a0(Ticket\u00a0No:\u00a013245687)',
    amount: '500.00',
  },{
    id: 'PAY123456',
    date: '2025\u00a0January\u00a008',
    time: '09:07',
    description: 'Payment\u00a0(Ticket\u00a0No:\u00a045678910)',
    amount: '500.00',
  },{
    id:'DEB123456',
    date: '2024\u00a0November\u00a008',
    time: '09:07',
    description: 'Monthly\u00a0Charge',
    amount: '20.00',
  },{
    id: 'CRD123456',
    date: '2024\u00a0September\u00a008',
    time: '09:07',
    description: 'Monthly\u00a0Income',
    amount: '500.00',
  },{
    id: 'TOP123456',
    date: '2025\u00a0June\u00a008',
    time: '09:07',
    description: 'Online\u00a0Top-Up',
    amount: '500.00',
  },{
    id:'REF123456',
    date: '2025\u00a0May\u00a008',
    time: '09:07',
    description: 'Refund\u00a0(Ticket\u00a0No:\u00a013245687)',
    amount: '500.00',
  },{
    id: 'PAY123456',
    date: '2025\u00a0January\u00a008',
    time: '09:07',
    description: 'Payment\u00a0(Ticket\u00a0No:\u00a045678910)',
    amount: '500.00',
  },{
    id:'DEB123456',
    date: '2024\u00a0November\u00a008',
    time: '09:07',
    description: 'Monthly\u00a0Charge',
    amount: '20.00',
  },{
    id: 'CRD123456',
    date: '2024\u00a0September\u00a008',
    time: '09:07',
    description: 'Monthly\u00a0Income',
    amount: '500.00',
  }

];

export default function TransctionTable() {
  return (
    <TableContainer 
    component={Paper} 
    sx={{ 
      minWidth: '270px', 
      width: 'calc(100%-40px)', 
      backgroundColor:'transparent',
      border: 'none',
      margin: '10px',
      padding:0,
      overflow: 'hidden',
    }}>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor:'rgb(248, 248, 255, 0.8)',
          borderRadius: '15px',
          overflow: 'hidden',
          height:'60px',
          padding:0,
          margin: '0 0 20px 0',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
          <Typography sx={{
            fontSize:'20px',
            fontFamily:'system-UI', 
            fontWeight:'bold',
          }}> Available&nbsp;Credits:&nbsp;LKR&nbsp;{credits} </Typography>
      </TableContainer>

      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor:'rgb(248, 248, 255, 0.8)',
          borderRadius: '15px',
          overflow: 'auto',
          height: 'calc(100% - 120px)',
          maxHeight: '60vh',
          margin:0,
          padding: 0
        }}
      >

        {/* Headers */}
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650, width: '100%'}}>
          <TableHead >
            <TableRow >
              <TableCell align="center" sx={{fontSize:'18px', fontFamily:'system-UI', fontWeight:'bold'}}> Transcation&nbsp;ID</TableCell>
              <TableCell align="center" sx={{fontSize:'18px', fontFamily:'system-UI', fontWeight:'bold'}}> Date </TableCell>
              <TableCell align="center" sx={{fontSize:'18px', fontFamily:'system-UI', fontWeight:'bold'}}> Time&nbsp;(Hrs)</TableCell>
              <TableCell align="center" sx={{fontSize:'18px', fontFamily:'system-UI', fontWeight:'bold'}}> Description</TableCell>
              <TableCell align="right"  sx={{fontSize:'18px', fontFamily:'system-UI', fontWeight:'bold'}}> Amount&nbsp;(LKR)</TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
          { rows.length > 0 ? rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>{row.id}</TableCell>
              <TableCell align="center" sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>{row.date}</TableCell>
              <TableCell align="center" sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>{row.time}</TableCell>
              <TableCell align="center" sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>{row.description}</TableCell>
              <TableCell align="right"  sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>{row.amount}</TableCell>
            </TableRow>
          )):(
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }}} >
              <TableCell colSpan={5} align="center"  sx={{fontSize:'16px', fontFamily:'system-UI', fontWeight:'bold'}}>No&nbsp;Transaction&nbsp;Records!</TableCell>
            </TableRow>
          )
          }
        </TableBody>
        </Table>
      </TableContainer>
    </TableContainer>
  );
}
