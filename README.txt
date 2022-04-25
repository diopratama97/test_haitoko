READ ME

1.  clone repository
2. instal package dengan menjalan kan npm I / npm install
4. import database yg berada di folder config/db 
5. jalan kan server dengan npm start
6. untuk desain rest api berada di swagger. Dengan mengakses http://localhost:3030/docs-api jika server sudah berjalan
7. untuk hasil run api. berada di dalam folder test_haitoko
8. desain db berada di folder config/db
9. untuk contoh payload request berada di swagger
10. untuk menggunakan callback bisa dengan payload di bawah ini. Saya menggunakan ngrok untuk membuat server local di laptop saya menjadi online dan bisa di akses oleh xendit. Karena url nya sering berubah ubah ketika start ngrok, bisa menggunakan payload di bawah ini dengan mengganti value external_id dengan invoice_no_ext yg berada di tabel invoice

{
    "id": "579c8d61f23fa4ca35e52da4",
    "external_id": "invoice_123124123",
    "user_id": "5781d19b2e2385880609791c",
    "is_high": true,
    "payment_method": "BANK_TRANSFER",
    "status": "PAID",
    "merchant_name": "Xendit",
    "amount": 50000,
    "paid_amount": 50000,
    "bank_code": "PERMATA",
    "paid_at": "2016-10-12T08:15:03.404Z",
    "payer_email": "wildan@xendit.co",
    "description": "This is a description",
    "adjusted_received_amount": 47500,
    "fees_paid_amount": 0,
    "updated": "2016-10-10T08:15:03.404Z",
    "created": "2016-10-10T08:15:03.404Z",
    "currency": "IDR",
    "payment_channel": "PERMATA",
    "payment_destination": "888888888888"
}
 
