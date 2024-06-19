#!/bin/bash
npx nodemon --exec 'node \
  --inspect=0.0.0.0:9229 \
  --require ts-node/register src/index.ts'

