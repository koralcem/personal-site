import sys
import os

if sys.hexversion < 0x2060000: os.execl('/home/koralcem/opt/python-3.4.3', 'python-3.4.3', *sys.argv)

cwd = os.getcwd()
print(cwd)
sys.path.append(cwd)
sys.path.append(cwd + '/portfolio')
sys.path.append(cwd + '/portfolio/portfolio')
os.environ['DJANGO_SETTINGS_MODULE'] = "portfolio.settings"

# from paste.exceptions.errormiddleware import ErrorMiddleware
 
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()


# To cut django out of the loop, comment the above application = ... line ,
# and remove "test" from the below function definition.
def testapplication(environ, start_response):
	print('Is this even called?')
	status = '200 OK'
	output = 'Hello World! Running Python version ' + sys.version + '\n\n'
	response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(len(output)))]
	# to test paste's error catching prowess, uncomment the following line
	# while this function is the "application"
	print('Raising...')
	raise("error")
	start_response(status, response_headers)
	return [output]

# print('Starting mock app')
# application = ErrorMiddleware(application, debug=False)
