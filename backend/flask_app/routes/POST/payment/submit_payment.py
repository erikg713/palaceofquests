@auth_bp.route('/payment/submit', methods=['POST'])
def submit_payment():
    payment_id = request.json.get('paymentId')
    txid = pi.submit_payment(payment_id)
    return jsonify({ "txid": txid })
