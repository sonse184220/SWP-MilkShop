import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export function QR({ isMember }) {
    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img style={{
                width: '100%',
                height: '155px',
                objectFit: 'cover'
            }} src="/img/milkbuying.jpeg" />
            <h1 style={{ textAlign: 'center' }}>Banking QR</h1>
            <div style={{ textAlign: 'center', fontSize: '20px', margin: '10px auto' }}>Thanks for buying. Please scan this for banking payment and our staff will check your payment</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img style={{ width: '20%' }} src="/img/qr3.jpg" />
            </div>
            <Footer />
        </>
    );
};