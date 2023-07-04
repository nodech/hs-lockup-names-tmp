'use strict';

// These names are blacklisted entirely.
exports.BLACKLIST = [
  'example', // ICANN reserved
  'invalid', // ICANN reserved
  'local', // mDNS
  'localhost', // ICANN reserved
  'test' // ICANN reserved
];

exports.TLD = [
  'arpa',
  'com',
  'edu',
  'gov',
  'int',
  'mil',
  'net',
  'org'
];

// Trademarked TLDs (these are domains
// who submitted a trademark claim).
exports.TRADEMARKS = [
  'a16z',
  'a16zcrypto',
  'agari',
  'anchorage',
  'angellikefire',
  'astralship',
  'barcraft',
  'base58',
  'bermuda',
  'binance',
  'blender',
  'blockfolio',
  'bubblestudent',
  'buddy',
  'cakephp',
  'candybar',
  'codewars',
  'coindera',
  'coingecko',
  'comunitaria',
  'contrib',
  'cryptopedia',
  'decentral',
  'district0x',
  'documize',
  'ecorp',
  'ejbca',
  'fossa',
  'freenode',
  'gainesvillecoins',
  'gnome',
  'grownome',
  'infura',
  'iocom',
  'jaxx',
  'knoxwallet',
  'lbry',
  'longgame',
  'mackup',
  'mattslater',
  'maxsys',
  'me3d',
  'metamask',
  'mixbook',
  'namecheap',
  'nettalk',
  'nextdoor',
  'nexves',
  'notationcapital',
  'num',
  'nxlog',
  'organism',
  'originprotocol',
  'paddle8',
  'paloma',
  'pewresearch',
  'privateinternetaccess',
  'showclix',
  'snapship',
  'socialchess',
  'spontaneous',
  'tech2mkt',
  'tenonedesign',
  'tierion',
  'tiki',
  'tikiwiki',
  'tokensoft',
  'tripletiedout',
  'unitychain',
  'useexplore',
  'userland',
  'vaporware',
  'wikihow',
  'wolk'
];
