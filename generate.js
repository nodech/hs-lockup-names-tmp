#!/usr/bin/env node

'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const rules = require('hsd/lib/covenants/rules');
const util = require('./lib/util');

const configs = util.parseConfig();

const TOPN = configs.uint('top', 10000);
const FILL = configs.bool('fill', false);
const RESERVE_NEW = configs.bool('reserve', false);
const NAMES_PATH = util.NAMES_PATH;
const BUILD_PATH = util.BUILD_PATH;

const BLACKLIST = require(path.join(NAMES_PATH, 'blacklist.json'));
const CUSTOM = require(path.join(NAMES_PATH, 'custom.json'));
const TRADEMARKS = require(path.join(NAMES_PATH, 'trademarks.json'));
const RTLD = require(path.join(NAMES_PATH, 'rtld.json'));
const ALEXA = require(path.join(NAMES_PATH, 'alexa.json'));
const WORDS = require(path.join(NAMES_PATH, 'words.json'));

const blacklist = new Set(BLACKLIST);
const words = new Set(WORDS);
const network = require('hsd/lib/protocol/network').get('main');

const VALID_PATH = path.join(BUILD_PATH, `valid-${TOPN}-`
  + `${FILL ? 'fill' : 'nofill'}-`
  + `${RESERVE_NEW ? 'reserve' : 'noreserve' }`
  + '.json');

const INVALID_PATH = path.join(BUILD_PATH, `invalid-${TOPN}-`
  + `${FILL ? 'fill' : 'nofill'}-`
  + `${RESERVE_NEW ? 'reserve' : 'noreserve' }`
  + '.json');

// const LOCKUP_JSON = path.join(BUILD_PATH, 'lockup.json');
// const LOCKUP_DB = path.join(BUILD_PATH, 'lockup.db');

function compile() {
  const table = new Map();
  const names = [];
  const invalid = [];

  const invalidate = (domain, name, rank, reason, winner = null) => {
    invalid.push({
      domain,
      rank,
      name,
      reason,
      winner
    });

    if (winner)
      reason += ` with ${winner.domain} (${winner.rank})`;

    console.error('Ignoring %s (%d) (reason=%s).', domain, rank, reason);
  };

  const insert = (domain, rank, name, tld) => {
    // Ignore blacklist.
    if (blacklist.has(name)) {
      invalidate(domain, name, rank, 'blacklist');
      return;
    }

    // Ignore domains that were NOT reserved.
    const hash = rules.hashName(name);

    if (!RESERVE_NEW && !rules.isReserved(hash, 1, network)) {
      invalidate(domain, name, rank, 'not-reserved');
      return;
    }

    // Check for collisions.
    const cache = table.get(name);

    if (cache) {
      assert(rank > 0);

      if (cache.rank === -2)
        invalidate(domain, name, rank, 'existing-naming-project', cache);
      else if (cache.rank === -1)
        invalidate(domain, name, rank, 'trademarked', cache);
      else
        invalidate(domain, name, rank, 'collision', cache);

      cache.collisions += 1;

      return;
    }

    const item = {
      domain,
      rank,
      name,
      tld,
      collisions: 0
    };

    table.set(name, item);
    names.push(item);
  };

  // Custom TLDs (these are domains
  // for existing naming projects).
  for (const [name, domain] of CUSTOM) {
    const tld = domain.split('.').slice(1).join('.');

    assert(!blacklist.has(name));

    insert(domain, -2, name, tld);
  }

  // Trademarked TLDs (these are domains
  // who submitted a trademark claim).
  for (const [name, domain] of TRADEMARKS) {
    const tld = domain.split('.').slice(1).join('.');

    assert(!blacklist.has(name));

    insert(domain, -1, name, tld);
  }

  // Root TLDs.
  for (const name of RTLD)
    insert(name, 0, name, '');

  assert(ALEXA.length >= 300000);

  let countAlexa = 0;

  // Alexa top 100,000 second-level domains.
  for (let i = 0; i < TOPN; i++) {
    const domain_ = ALEXA[i];
    const parts = domain_.split('.');
    const rank = i + 1;

    // Strip leading `www`.
    while (parts.length > 2 && parts[0] === 'www')
      parts.shift();

    assert(parts.length >= 2);

    const domain = parts.join('.');

    // Ignore plain `www`.
    if (parts[0] === 'www') {
      invalidate(domain, 'www', rank, 'plain-www');
      continue;
    }

    // Ignore deeply nested domains.
    if (parts.length > 3) {
      invalidate(domain, '', rank, 'deeply-nested');
      continue;
    }

    // Third-level domain.
    if (parts.length === 3) {
      const [name, sld, tld] = parts;

      // Country Codes only (e.g. co.uk, com.cn).
      if (!util.isCCTLD(tld)) {
        invalidate(domain, name, rank, 'deeply-nested');
        continue;
      }

      // The SLD must be a known TLD
      // (or a widley used second-level
      // domain like `co` or `ac`).
      // Prioritize SLDs that have at
      // least 3 in the top 100k.
      switch (sld) {
        case 'com':
        case 'edu':
        case 'gov':
        case 'mil':
        case 'net':
        case 'org':
        case 'co': // common everywhere (1795)
        case 'ac': // common everywhere (572)
        case 'go': // govt for jp, kr, id, ke, th, tz (169)
        case 'gob': // govt for mx, ar, ve, pe, es (134)
        case 'nic': // govt for in (97)
        case 'or': // common in jp, kr, id (64)
        case 'ne': // common in jp (55)
        case 'gouv': // govt for fr (32)
        case 'jus': // govt for br (28)
        case 'gc': // govt for ca (19)
        case 'lg': // common in jp (15)
        case 'in': // common in th (14)
        case 'govt': // govt for nz (11)
        case 'gv': // common in au (8)
        case 'spb': // common in ru (6)
        case 'on': // ontario domain for ca (6)
        case 'gen': // common in tr (6)
        case 'res': // common in in (6)
        case 'qc': // quebec domain for ca (5)
        case 'kiev': // kiev domain for ua (5)
        case 'fi': // common in cr (4)
        case 'ab': // alberta domain for ca (3)
        case 'dn': // common in ua (3)
        case 'ed': // common in ao and jp (3)
          break;
        default:
          invalidate(domain, name, rank, 'deeply-nested');
          continue;
      }
    }

    // Get lowest-level name.
    const name = parts.shift();

    // Must match HNS standards.
    if (!util.isHNS(name)) {
      invalidate(domain, name, rank, 'formatting');
      continue;
    }

    // Ignore single letter domains.
    if (name.length === 1) {
      invalidate(domain, name, rank, 'one-letter');
      continue;
    }

    // Use stricter rules after rank 50k.
    if (rank > 50000) {
      // Ignore two-letter domains after 50k.
      if (name.length === 2) {
        invalidate(domain, name, rank, 'two-letter');
        continue;
      }
      // Ignore english words after 50k.
      if (words.has(name)) {
        invalidate(domain, name, rank, 'english-word');
        continue;
      }
    }

    const tld = parts.join('.');

    insert(domain, rank, name, tld);
    countAlexa++;

    if (FILL && countAlexa >= TOPN)
      break;

    if (!FILL && i === TOPN)
      break;
  }

  return [names, invalid];
}

function sortRank(a, b) {
  if (a.rank < b.rank)
    return -1;

  if (a.rank > b.rank)
    return 1;

  return util.compare(a.name, b.name);
}

console.error(`Compiling top ${TOPN} Alexa domains from ${util.getName()}...`);
console.error(`  ${FILL ? 'FILL until ' + TOPN : 'FILTER from ' + TOPN} Alexa domains...`);
// eslint-disable-next-line max-len
console.error(`  ${RESERVE_NEW ? 'Reserve' : 'Do not reserve'} new Alexa/ICANN/CUSTOM/TRADEMARK domains...`);

const [names, invalid] = compile();
// const items = [];

if (!fs.existsSync(BUILD_PATH))
  fs.mkdirSync(BUILD_PATH);

{
  const json = [];

  json.push('{');

  names.sort(sortRank);

  for (const {name, tld, rank, collisions} of names)
    json.push(`  "${name}": ["${tld}", ${rank}, ${collisions}],`);

  json[json.length - 1] = json[json.length - 1].slice(0, -1);
  json.push('}');
  json.push('');

  const out = json.join('\n');

  fs.writeFileSync(VALID_PATH, out);
}

{
  const json = [];

  json.push('[');

  invalid.sort(sortRank);

  for (const {domain, name, rank, reason, winner} of invalid) {
    if (winner) {
      const wd = winner.domain;
      const wr = winner.rank;
      // eslint-disable-next-line max-len
      json.push(`  ["${domain}", "${name}", ${rank}, "${reason}", ["${wd}", ${wr}]],`);
    } else {
      json.push(`  ["${domain}", "${name}", ${rank}, "${reason}"],`);
    }
  }

  json[json.length - 1] = json[json.length - 1].slice(0, -1);
  json.push(']');
  json.push('');

  const out = json.join('\n');

  fs.writeFileSync(INVALID_PATH, out);
}

