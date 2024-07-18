build: clean
	tsc
	
clean:
	rmdir /s /q build\scripts

serve:
	python -m http.server -d build 8000