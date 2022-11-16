from api import app

@app.route('/asdf', methods=['GET'])
def asdf():
    return 'success', 200