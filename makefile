build-win: clean-win
	tsc
	
clean-win:
	rmdir /s /q build\scripts

build-linux: clean-linux
	tsc

clean-linux:
	rm -rf build/scripts

serve:
	python -m http.server -d build 8000