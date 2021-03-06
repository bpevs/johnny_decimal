start:
	deno run --allow-read --allow-write --allow-env source/main.ts

install:
	deno install --allow-read --allow-write --allow-env --name=jd source/main.ts

uninstall:
	deno uninstall jd

test:
	deno test --allow-env --allow-read
