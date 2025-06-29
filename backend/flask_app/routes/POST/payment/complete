@auth_bp.route('/payment/complete', methods=['POST'])
def complete_payment():
    payment_id = request.json.get('paymentId')
    txid = request.json.get('txid')
    payment = pi.complete_payment(payment_id, txid)

    # Add item to inventory
    item_id = payment['metadata']['item_id']
    user_id = payment['user_uid']

    inv = Inventory.query.filter_by(user_id=user_id, item_id=item_id).first()
    if inv:
        inv.qty += 1
    else:
        new_inv = Inventory(user_id=user_id, item_id=item_id, qty=1)
        db.session.add(new_inv)

    db.session.commit()
    return jsonify({ "success": True, "item_id": item_id })
