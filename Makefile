start:
	deno run --allow-read --allow-write --allow-env --allow-run source/main.ts

install:
	deno install --allow-read --allow-write --allow-env --allow-run --name=jd source/main.ts

uninstall:
	deno uninstall jd

test:
	deno test --allow-read
