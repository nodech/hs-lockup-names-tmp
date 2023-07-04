'use strict';

exports.CUSTOM = [
  'bit',   // Namecoin
  'eth',   // ENS
  'exit',  // Tor
  'gnu',   // GNUnet (GNS)
  'i2p',   // Invisible Internet Project
  'onion', // Tor
  'tor',   // Tor (OnioNS)
  'zkey',  // GNS

  // Required to make the custom values work:
  'afilias',     // Afilias plc (does not rank)
  'blockstack',  // Blockstack (does not rank)
  'brave',       // Brave (english word)
  'darksi',      // Individual (does not rank)
  'datprotocol', // Dat Project (does not rank)
  'debian',      // Debian (prefer over .org)
  'dnscrypt',    // DNScrypt (does not rank)
  'eff',         // Electronic Frontier Foundation (prefer over .org)
  'gnunet',      // GNUnet (does not rank)
  'keybase',     // Keybase (prefer over keybase.pub)
  'm-d',         // Individual (does not rank)
  'marples',     // Individual (does not rank)
  'mozilla',     // Mozilla Foundation (prefer over .org)
  'nlnetlabs',   // Unbound (does not rank)
  'numcalc',     // Individual (does not rank)
  'pir'          // Public Internet Registry (does not rank)
].sort((a, b) => {
  return a.localeCompare(b);
});


