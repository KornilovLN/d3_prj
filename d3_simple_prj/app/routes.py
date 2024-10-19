from flask import Blueprint, render_template
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    current_year = datetime.now().year
    return render_template('index.html', year=current_year)

@main.route('/d3_test/<int:test_number>')
def d3_test(test_number):
    current_year = datetime.now().year
    template_name = f'd3_test_0{test_number}.html'
    return render_template(template_name, year=current_year)