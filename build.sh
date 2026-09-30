#!/bin/bash
# Builds the standalone wonderlings-vN.html from source.
# Usage: ./build.sh 5
# The version MUST match the footer in index.html (<p id="ver">wonderlings vN</p>)
# — bump it there first (durable rule: the build is stamped at the source).
set -e
V="${1:?usage: ./build.sh <version>}"
python3 - "$V" <<'PYEOF'
import sys, subprocess, tempfile, os
v = sys.argv[1]
html = open("index.html").read()
css = open("style.css").read()
js = open("game.js").read()
assert ("wonderlings v%s" % v) in html, "bump the ver footer in index.html to v%s first!" % v
assert "</script>" not in js, "game.js must not contain a literal </script>"
out = html.replace('<link rel="stylesheet" href="style.css">',
                   "<style>\n" + css + "\n</style>")
out = out.replace('<script src="game.js"></script>',
                  "<script>\n" + js + "\n</script>")
assert out.count("<script>") == 1 and out.count("</script>") == 1, \
    "must be exactly one script pair"
assert out.count("<style>") == 1 and out.count("</style>") == 1, \
    "must be exactly one style pair"
m = out.split("<script>")[1].split("</script>")[0]
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
    f.write(m); tmp = f.name
r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
os.unlink(tmp)
assert r.returncode == 0, "inline JS syntax error:\n" + r.stderr
# the shipped script must be byte-identical to game.js (faithful build)
assert m.strip() == js.strip(), "inline script diverged from game.js!"
open("wonderlings-v%s.html" % v, "w").write(out)
print("OK: wonderlings-v%s.html (%d bytes)" % (v, len(out)))
PYEOF
