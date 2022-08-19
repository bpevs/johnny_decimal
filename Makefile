start:
	deno run -A source/main.ts

install:
	deno install -A -f --name=jd source/main.ts

uninstall:
	deno uninstall jd

test:
	deno test --allow-env --allow-read
