#!/bin/bash

curl 'https://compstats.uefa.com/v1/player-ranking?competitionId=3&limit=500&offset=0&optionalFields=PLAYER&order=DESC&phase=TOURNAMENT&seasonYear=2024&stats=clean_sheet' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'origin: https://www.uefa.com' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.uefa.com/' \
  -H 'sec-ch-ua: "Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-gpc: 1' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' \
  -H 'x-api-key: ceeee1a5bb209502c6c438abd8f30aef179ce669bb9288f2d1cf2fa276de03f4' | jq '[.[] | { name: .player.internationalName, country: .player.countryCode, position: .player.nationalFieldPosition, cleanSheets: .statistics[0].value } | select(.position == "GOALKEEPER")]'

