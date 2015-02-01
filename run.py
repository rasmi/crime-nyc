import os
import api
from api.app import app

def run():
	port = int(os.environ.get('PORT', 5000))
	api.app.prepare_data()
	app.root_path = os.path.abspath(os.path.dirname(__file__))
	app.run(host='0.0.0.0', port=port, debug = True, use_reloader = False)

if __name__ == '__main__':
	run()