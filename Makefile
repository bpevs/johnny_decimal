start:
	deno run --allow-read --allow-write --allow-env --allow-run source/deno-cli/main.ts

install:
	deno install --allow-read --allow-write --allow-env --allow-run --name=jd source/deno-cli/main.ts

uninstall:
	deno uninstall jd
