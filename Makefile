
.PHONY: build

build:
	rm -f .next/_next
	npm run build
	npm run start &
	sleep 1
	curl http://127.0.0.1:3000 > .next/index.html
	ln -s . .next/_next
	pgrep -f 'next start'|xargs kill &
