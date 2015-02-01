from flask import Flask, jsonify, request, make_response
import pandas as pd
import requests
import json

app = Flask(__name__)

#ll_crime_by_month_json = None
#all_crime_by_month = None
crime_by_month_json = None
crime_by_month = None
colors = {
	'BURGLARY': 'purple',
	'FELONY ASSAULT': 'blue',
	'GRAND LARCENY': 'green',
	'GRAND LARCENY OF MOTOR VEHICLE': 'orange',
	'MURDER': 'red',
	'RAPE': 'black',
	'ROBBERY': 'blueviolet'
}
totals_by_crime = None
stacked_graph_data = None
graph_data = None

def prepare_data():
	#global all_crime_by_month_json
	#global all_crime_by_month
	#all_crime_by_month_json = json.loads(open(app.root_path + '/data/all_crime_by_month.geojson').read())
	#all_crime_by_month = pd.io.json.json_normalize(all_crime_by_month_json['features'])
	
	#global crime_by_month_json
	#global crime_by_month
	#crime_by_month_json = json.loads(open(app.root_path + '/data/crime_by_month.geojson').read())
	#crime_by_month = pd.io.json.json_normalize(crime_by_month_json['features'])
	#totals_by_crime = pd.pivot_table(crime_by_month, values='properties.TOT', index=['properties.MO'], columns=['properties.CR'], aggfunc='sum')
	#stacked_graph_data = [{'key': crime, 'color': colors[crime], 'values': [{'x': month, 'y': total} for month, total in crimestats.iteritems()]} for crime, crimestats in totals_by_crime.to_dict().iteritems()]

	graph_data = json.loads(open(app.root_path + '/data/graph_data.json').read())


@app.route('/')
def home():
	return make_response(open('static/index.html').read())

@app.route('/crimes')
def crimes():
	"""
	Get graph data:
	[
		{
			key : crime
			values: [{x: 1, y: 1234}, {x: 2, y: 1234}]
		},
	]
	"""
	return jsonify(data=graph_data)