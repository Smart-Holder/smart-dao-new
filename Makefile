
.PHONY: build

build:
	npm run build
	npm run start &
	sleep 1
	curl http://127.0.0.1:3000 > .next/index.html
	if [ ! -L .next/_next ]; then ln -s . .next/_next; fi
	pgrep -f 'next start'|xargs kill &
