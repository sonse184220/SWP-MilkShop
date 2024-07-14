import DataTable from 'react-data-table-component';
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';

import './Report.css'
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { GetUserReport } from '../../services/report/getUserReport';

export function Report({ isMember }) {
    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

    const [reports, setReports] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalCount, setTotalCount] = React.useState(0);

    const handleGetUserReport = async () => {
        try {
            let limit = rowsPerPage
            let cpage = page + 1;
            let sort = "";
            let status = "";
            const response = await GetUserReport(MemberToken, userId, limit, cpage, sort, status);
            if (response.data.total > 0) {
                setReports(response.data.data)
                setTotalCount(response.data.totalPages);
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        handleGetUserReport();
    }, [])

    React.useEffect(() => {
        handleGetUserReport();
    }, [page, rowsPerPage])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className="image" src="/img/pinkbg.jpg" />
            <div className='report-table'>
                <TableContainer component={Paper} className="mb-4 rounded-lg overflow-hidden"
                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                >
                    <Table aria-label="collapsible table" style={{ borderRadius: '20px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>ReportID</TableCell>
                                <TableCell align="center">OrderType</TableCell>
                                <TableCell align="center">OrderID</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Report Date</TableCell>
                                <TableCell align="center">Update Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report) => (
                                <Row key={report.ReportID} row={report} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="report-pagination flex justify-between items-center bg-white  rounded-lg">
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15]}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

// function createData(name, calories, fat, carbs, protein, price) {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//         price,
//         history: [
//             {
//                 date: '2020-01-05',
//                 customerId: '11091700',
//                 amount: 3,
//             },
//             {
//                 date: '2020-01-02',
//                 customerId: 'Anonymous',
//                 amount: 1,
//             },
//         ],
//     };
// }

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow
            // sx={{ '& > *': { borderBottom: 'unset' } }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.ReportID}
                </TableCell>
                <TableCell align="right">{row.OrderType}</TableCell>
                <TableCell align="right">{row.OrderID}</TableCell>
                <TableCell align="right">{!row.StaffID ? 'Processing' : 'Done'}</TableCell>
                <TableCell align="right">{row.created}</TableCell>
                <TableCell align="right">{row.updated}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" className='text-center'>
                                Report Detail
                            </Typography>
                            <div className='row report-detail'>
                                <div className='col-6'>
                                    <div className='flex row'>
                                        <h5 className='col-2'>Title</h5>
                                        <input className='col-7 form-control'
                                            value={row.Title}
                                            readOnly
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                    <br />
                                    <div className='flex row'>
                                        <h5 className='col-2'>Content</h5>
                                        <textarea className='col-7 form-control'
                                            value={row.Content}
                                            readOnly
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <h5>Response</h5>
                                    <textarea className='form-control'
                                        value={row.Response}
                                        readOnly
                                        style={{ height: '70%' }}
                                    />
                                </div>
                            </div>
                            {/* <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell align="right">
                                                {Math.round(historyRow.amount * row.price * 100) / 100}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table> */}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// Row.propTypes = {
//     row: PropTypes.shape({
//         calories: PropTypes.number.isRequired,
//         carbs: PropTypes.number.isRequired,
//         fat: PropTypes.number.isRequired,
//         history: PropTypes.arrayOf(
//             PropTypes.shape({
//                 amount: PropTypes.number.isRequired,
//                 customerId: PropTypes.string.isRequired,
//                 date: PropTypes.string.isRequired,
//             }),
//         ).isRequired,
//         name: PropTypes.string.isRequired,
//         price: PropTypes.number.isRequired,
//         protein: PropTypes.number.isRequired,
//     }).isRequired,
// };

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
//     createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
//     createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
//     createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
// ];

// export default function CollapsibleTable() {
//     return (
//         <TableContainer component={Paper}>
//             <Table aria-label="collapsible table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell />
//                         <TableCell>Dessert (100g serving)</TableCell>
//                         <TableCell align="right">Calories</TableCell>
//                         <TableCell align="right">Fat&nbsp;(g)</TableCell>
//                         <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//                         <TableCell align="right">Protein&nbsp;(g)</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {rows.map((row) => (
//                         <Row key={row.name} row={row} />
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }