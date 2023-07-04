'use strict';

// This part is not fun.
//
// Explanation:
//
// The United States has trade
// embargoes against a number of
// countries on the grounds of
// human rights violations, among
// other things.
//
// In particular, the US state
// department reserves this right:
// "Authority to prohibit any U.S.
// citizen from engaging in a
// financial transaction with a
// terrorist-list government
// without a Treasury Department
// license."
//
// See: https://www.state.gov/j/ct/rls/crt/2009/140889.htm
//
// Whether we find these embargoes
// justified or not, the fact is,
// several handshake contributors
// are American citizens and must
// abide by American laws.
//
// The handshake blockchain is not a
// system of money or funding, but to
// avoid creating some kind of
// international incident, we do not
// allow any handshake coins to be
// redeemed as a reward for name
// claiming by these countries.
// Offering claim rewards could be
// seen as "funding" of these nations'
// governments.
//
// If Nathan Fielder has taught us
// anything, it's that wikipedia has
// good answers to legal questions,
// so take a look at wikipedia for
// more info:
//   https://en.wikipedia.org/wiki/United_States_embargoes
//   https://en.wikipedia.org/wiki/United_States_embargoes#Countries
exports.embargoes = new Set([
  'ir', // Iran
  'xn--mgba3a4f16a', // Iran (punycode)
  'kp', // North Korea
  'sy', // Syria
  'xn--ogbpf8fl', // Syria (punycode)
  'sd', // Sudan
  'xn--mgbpl2fh', // Sudan (punycode)

  // Sanctions exist for these countries,
  // despite them not being specifically
  // listed as "terrorist governments".
  'cu', // Cuba
  've'  // Venezuela
]);

// Force top 100 status for these TLDs.
// They don't rank on Alexa, but the
// owners of these TLDs also own high
// ranking SLDs.
exports.forceTop100 = new Set([
  'youtube', // youtube.com
  'google', // google.com
  'baidu', // baidu.com
  'yahoo', // yahoo.com
  'taobao', // taobao.com
  'tmall', // tmall.com
  'sohu', // sohu.com
  'sina', // sina.com.cn
  'weibo', // weibo.com
  'yandex', // yandex.ru
  'netflix', // netflix.com
  'bing', // bing.com
  'alipay', // alipay.com
  'imdb', // imdb.com
  'microsoft', // microsoft.com
  'office', // office.com
  'apple', // apple.com
  'booking' // booking.com
]);

