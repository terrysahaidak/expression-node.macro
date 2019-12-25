#!/usr/bin/env bash
watchman trigger-del ./test/src macro-test;
watchman -j <<-EOT
["trigger", "`pwd`/test/src", {
   "name": "macro-test",
   "command": ["npm", "run", "compile-test"],
   "append_files": false
}]
EOT