/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/404.html","b5f1aaf37ca4f91479fe876648d9b41b"],["/about/index.html","2ead07dc24603d3e8d188e3f0954be23"],["/api/index.html","537007854d3e1074a207c896a75fb8fe"],["/assets/css/alertify.css","3c669579fbb6aa185955f4fa87118671"],["/assets/css/main.css","4a28177185ce4cc78954fea94c7ad95d"],["/assets/css/video-js.min.css","716282aa55497a5ebd6c590e83c46388"],["/assets/img/custom/composed1.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_goup.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_lg.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_md.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_placehold.png","8bc4fcc0acfd98a042ef530cfbe84ae1"],["/assets/img/custom/composed1_sm.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_thumb.png","f914f35949ab4e0ff5a7c1f19f58315d"],["/assets/img/custom/composed1_thumb@2x.png","5fad84e0b4071e6be50a98d4b6c95cfb"],["/assets/img/custom/composed1_xs.png","c9a6f70dd4b00c6443179d8197963910"],["/assets/img/custom/composed2.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_goup.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_lg.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_md.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_placehold.png","f2b112c1397621d9a7ddcd74e1b1324e"],["/assets/img/custom/composed2_sm.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_thumb.png","a01e2b5f532f7acf8b2156828c9036be"],["/assets/img/custom/composed2_thumb@2x.png","e452fcfbbfb3a65a3fa91c0d42d1338d"],["/assets/img/custom/composed2_xs.png","ff0e69f441d431b48124fef271deb5cf"],["/assets/img/custom/editor_calcmap.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_goup.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_lg.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_md.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_placehold.jpg","b613f62801184c4f4ed8ce1912defddd"],["/assets/img/custom/editor_calcmap_sm.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_thumb.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_thumb@2x.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editor_calcmap_xs.jpg","3fd8e69cec5bc4aea416c7c2c0ffc978"],["/assets/img/custom/editquery.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery1.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_goup.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_lg.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_md.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_placehold.jpg","a343f21a0fa02a95f9c5a7c1b020959d"],["/assets/img/custom/editquery1_sm.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_thumb.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_thumb@2x.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery1_xs.jpg","376161f0c82d53577acdab9fa52bd316"],["/assets/img/custom/editquery2.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_goup.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_lg.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_md.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_placehold.jpg","e6090e8bd8f003b375a978487c964ab1"],["/assets/img/custom/editquery2_sm.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_thumb.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_thumb@2x.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery2_xs.jpg","402bcd85997b18fa20728035c3e0c1f7"],["/assets/img/custom/editquery_goup.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_lg.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_md.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_placehold.jpg","4afe06eed48b4e18aa26ab9d31ecc241"],["/assets/img/custom/editquery_sm.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_thumb.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_thumb@2x.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/editquery_xs.jpg","e6faf9826218a6fdae4a3c7fc88c6219"],["/assets/img/custom/filter1.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_goup.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_lg.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_md.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_placehold.png","9e5ac807ad6a5707afd63604c9f176f1"],["/assets/img/custom/filter1_sm.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_thumb.png","3966c185afe164d2a3341bcdd91a7e53"],["/assets/img/custom/filter1_thumb@2x.png","72a9554dce1090364f64bcf02444d221"],["/assets/img/custom/filter1_xs.png","279bb508ab0170834113184ed0b32a2b"],["/assets/img/custom/filter2.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_goup.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_lg.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_md.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_placehold.png","576080342f07a7220cee357efd564023"],["/assets/img/custom/filter2_sm.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_thumb.png","63126caaf802c324e06b544d0d80b850"],["/assets/img/custom/filter2_thumb@2x.png","ea1c6fa847688093d3ee4ad69baf558f"],["/assets/img/custom/filter2_xs.png","8857be31a7510797a020ecf8f5288f88"],["/assets/img/custom/homeserver.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_goup.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_lg.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_md.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_placehold.png","2795b1fd8aeab2c7378661bc7d8e4a77"],["/assets/img/custom/homeserver_sm.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_thumb.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_thumb@2x.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/homeserver_xs.png","97320a7982234364394847120ff3aa33"],["/assets/img/custom/inspectpixel1.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_goup.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_lg.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_md.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_placehold.png","d8295169becf2bf29375c3faf74caf43"],["/assets/img/custom/inspectpixel1_sm.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_thumb.png","790c2802f6db13dc539f07de84738e62"],["/assets/img/custom/inspectpixel1_thumb@2x.png","7e5c0e7f10d5599b318e3a86dc433245"],["/assets/img/custom/inspectpixel1_xs.png","1ccdcbfc360967730c2750dbb12f8cc0"],["/assets/img/custom/inspectpixel2.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_goup.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_lg.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_md.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_placehold.png","894ebe340a9368fac26d84742d4a52ac"],["/assets/img/custom/inspectpixel2_sm.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_thumb.png","6d6b4fddef6f11eb5982b61fed89cfb6"],["/assets/img/custom/inspectpixel2_thumb@2x.png","a081be3318e23a2edd674ad7fd4d7298"],["/assets/img/custom/inspectpixel2_xs.png","101dcff30772b998fd5581494bfcb849"],["/assets/img/custom/integrate.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_goup.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_lg.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_md.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_placehold.png","7ae4770b31d124124069cac9ca3ff3e8"],["/assets/img/custom/integrate_sm.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_thumb.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_thumb@2x.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/integrate_xs.png","549cffa3effcef6c81bb039769a897ec"],["/assets/img/custom/process1.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_goup.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_lg.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_md.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_placehold.png","ce49d6428bec1187b867908931530f57"],["/assets/img/custom/process1_sm.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_thumb.png","f92a24b4da92666f8d4fb4dccb925ff3"],["/assets/img/custom/process1_thumb@2x.png","0a5fb8615ea8903793cd10d729008640"],["/assets/img/custom/process1_xs.png","a604967ffd40c8562102b4bc009046a0"],["/assets/img/custom/process2.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_goup.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_lg.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_md.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_placehold.png","e779f34e6ddc50d128229b39da1a551e"],["/assets/img/custom/process2_sm.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_thumb.png","76c20199912aa3e3ad4837908695a3d0"],["/assets/img/custom/process2_thumb@2x.png","c1f4e7665d874de097db8668696718aa"],["/assets/img/custom/process2_xs.png","21dfbaacb0c62419d980b4058baef7b8"],["/assets/img/custom/publish.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish1.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_goup.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_lg.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_md.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_placehold.jpg","0dadd408090b79bc5447efeabbf23a26"],["/assets/img/custom/publish1_sm.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_thumb.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_thumb@2x.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish1_xs.jpg","59f384a71015644fe5fd3ebfddc4e97a"],["/assets/img/custom/publish2.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_goup.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_lg.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_md.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_placehold.jpg","84f78881dc43f62a835dbd82d4e99538"],["/assets/img/custom/publish2_sm.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_thumb.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_thumb@2x.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish2_xs.jpg","5ce994c70c3b74e9303075a5387e1b62"],["/assets/img/custom/publish_goup.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_lg.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_md.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_placehold.jpg","16feeed5d06798179d73dccd31507a20"],["/assets/img/custom/publish_sm.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_thumb.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_thumb@2x.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/publish_xs.jpg","a162bd7c65ac55f3ca9f6023886b18bf"],["/assets/img/custom/server.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_goup.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_lg.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_md.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_placehold.jpg","ae43c1351f12820f7bc6b7f616fc3ed9"],["/assets/img/custom/server_sm.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_thumb.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_thumb@2x.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/server_xs.jpg","e19c78e4f16dd5df652976024f4a032c"],["/assets/img/custom/share.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share1.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_goup.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_goup.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_lg.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_lg.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_md.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_md.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_placehold.jpg","a9e56b76593d51a318a2fe62a52b5275"],["/assets/img/custom/share1_placehold.png","139c078ba24a4213b5747e74ce30648f"],["/assets/img/custom/share1_sm.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_sm.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_thumb.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_thumb.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_thumb@2x.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_thumb@2x.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share1_xs.jpg","5cb9284330a78a37387bd19ab02bc1c3"],["/assets/img/custom/share1_xs.png","e3df1b9d6ed26cd6841624db23ba36dc"],["/assets/img/custom/share2.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_goup.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_goup.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_lg.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_lg.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_md.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_md.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_placehold.jpg","30d716c4120e854dff864c6a60bf4d6d"],["/assets/img/custom/share2_placehold.png","473b95b3035a97e907cc563256248ca9"],["/assets/img/custom/share2_sm.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_sm.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_thumb.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_thumb.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_thumb@2x.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_thumb@2x.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share2_xs.jpg","85d4214b34be1977eb93abd1fa91c103"],["/assets/img/custom/share2_xs.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_goup.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_lg.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_md.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_placehold.png","473b95b3035a97e907cc563256248ca9"],["/assets/img/custom/share_sm.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_thumb.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_thumb@2x.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/share_xs.png","d948f35673dd9f3f59a7755670183efd"],["/assets/img/custom/timeline1.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_goup.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_lg.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_md.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_placehold.png","57ea08ca0894cd7f8706f67c7981aad1"],["/assets/img/custom/timeline1_sm.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_thumb.png","e663bb512cbae9055f3d4a33b6bbdc5d"],["/assets/img/custom/timeline1_thumb@2x.png","1d4e2fadcd482dbfeb36a32d9fcb0108"],["/assets/img/custom/timeline1_xs.png","524caa08d5558fd750517d82648b283e"],["/assets/img/custom/timeline2.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_goup.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_lg.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_md.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_placehold.png","075e67edb01fcf55b1e8004d19c6e817"],["/assets/img/custom/timeline2_sm.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_thumb.png","3d1438d8e88fbb58d5b8320194091cbd"],["/assets/img/custom/timeline2_thumb@2x.png","d71ca1c200e7a7c0c302137a75214152"],["/assets/img/custom/timeline2_xs.png","6cecb281196949eb632c41e1921eecaf"],["/assets/img/custom/transition1.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_goup.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_lg.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_md.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_placehold.png","fae5e647478da2750fb90d183d0fe69b"],["/assets/img/custom/transition1_sm.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_thumb.png","434fce67e2453a7b4dbf6852b5818395"],["/assets/img/custom/transition1_thumb@2x.png","29cba3cf17f56b6030623c9531d08591"],["/assets/img/custom/transition1_xs.png","85090b933c8c899c4e7b6cafbc2b18ba"],["/assets/img/custom/transition2.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_goup.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_lg.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_md.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_placehold.png","89a4837c85bef0e63cbd58f509b09681"],["/assets/img/custom/transition2_sm.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_thumb.png","a0f1935d647612e7b3ac74608e9b0ce9"],["/assets/img/custom/transition2_thumb@2x.png","1b1c2184bf28ea5c1540effa28513a5a"],["/assets/img/custom/transition2_xs.png","e40d4fd5af940519514dc2c1105705c2"],["/assets/img/icons/collapse.png","87d6442cba18f79423a8e37645cc0fc8"],["/assets/img/icons/expand.png","a785c24e1bd3879e5dcbb294e872dfcb"],["/assets/img/icons/icons8-classroom-30.png","4ebb242375eaf77dc9ec34fb9aebc471"],["/assets/img/icons/icons8-documents-30.png","654bcbb5dd3ee3e81afab5d386fca0ac"],["/assets/img/icons/icons8-factory-30.png","7b294baa7ab8938655959ad988aae7f2"],["/assets/img/icons/icons8-faq-30.png","8f2c96ee5894f0b481ec2a0bbfeb2b60"],["/assets/img/icons/icons8-map-editing-30.png","b7b5dffccdc98f863d9225d702373e3d"],["/assets/img/icons/icons8-statistics-30.png","ef6ce26fa01e041a05ccbda3f4a2dff1"],["/assets/img/icons/minus.png","7f61b001fa40a3f878a894cc982e7a04"],["/assets/img/icons/plus.png","569f40bf3132c99e988f7cb3f946468a"],["/assets/img/icons/sound_max.png","e08cb64a6f8e5896054792f0eeee3ffe"],["/assets/img/icons/sound_max.svg","ffe17278873ebb6bc57cd8249b15b96a"],["/assets/img/icons/sound_mute.png","e1f0b94c122fd058438355f19a019263"],["/assets/img/icons/sound_mute.svg","1731e2106b5fa94351250d4d9ac695cc"],["/assets/img/posts/CSR-Maps-bg.jpg","db2b0e5d4ebda7581e9aad47d3e1f58c"],["/assets/img/posts/CSR-Maps-bg_goup.jpg","f36a9101d3287a20074b884b7de9d538"],["/assets/img/posts/CSR-Maps-bg_lg.jpg","db2b0e5d4ebda7581e9aad47d3e1f58c"],["/assets/img/posts/CSR-Maps-bg_md.jpg","d61cc4349db94a4d155f270e77d28578"],["/assets/img/posts/CSR-Maps-bg_placehold.jpg","718305763890654f2ee025b0b294e34a"],["/assets/img/posts/CSR-Maps-bg_sm.jpg","3ed2019d863ae1c036020a3f0a6da54f"],["/assets/img/posts/CSR-Maps-bg_thumb.jpg","58fbe2c98474da5341b28dbabc1c6447"],["/assets/img/posts/CSR-Maps-bg_thumb@2x.jpg","4a91376a232666bcbe1bdcd1c5023471"],["/assets/img/posts/CSR-Maps-bg_xs.jpg","078fe4a8c12a9901d4bb064d33d6ac79"],["/assets/img/posts/amazones-panel.jpg","097bdfd3ce9c2185ea5f7409b45e22fb"],["/assets/img/posts/amazones-panel_goup.jpg","097bdfd3ce9c2185ea5f7409b45e22fb"],["/assets/img/posts/amazones-panel_lg.jpg","097bdfd3ce9c2185ea5f7409b45e22fb"],["/assets/img/posts/amazones-panel_md.jpg","097bdfd3ce9c2185ea5f7409b45e22fb"],["/assets/img/posts/amazones-panel_placehold.jpg","e49f3be9f493eb0d4354be46d35b435e"],["/assets/img/posts/amazones-panel_sm.jpg","199f3d45fb910df6811fd61b6154a1d7"],["/assets/img/posts/amazones-panel_thumb.jpg","5b16c5fd667e17e48df11cd874c77ec4"],["/assets/img/posts/amazones-panel_thumb@2x.jpg","097bdfd3ce9c2185ea5f7409b45e22fb"],["/assets/img/posts/amazones-panel_xs.jpg","e383456370662f051b661efd1a9c4836"],["/assets/img/posts/amazones_biodiversity-panel.jpg","cf3918cc6c550440c1816322e9aad58b"],["/assets/img/posts/amazones_biodiversity-panel_goup.jpg","70169291571714d85f58dcf9ca398133"],["/assets/img/posts/amazones_biodiversity-panel_lg.jpg","cf3918cc6c550440c1816322e9aad58b"],["/assets/img/posts/amazones_biodiversity-panel_md.jpg","354ef746d1aaa590492629c091c6c19c"],["/assets/img/posts/amazones_biodiversity-panel_placehold.jpg","cb5c9da35e62af0ed1e986420e973ab1"],["/assets/img/posts/amazones_biodiversity-panel_sm.jpg","7344d06d5b006a462598e309a3a15e2f"],["/assets/img/posts/amazones_biodiversity-panel_thumb.jpg","83450980192f0d7c1fe94b405714d841"],["/assets/img/posts/amazones_biodiversity-panel_thumb@2x.jpg","826009b4a659dbb25e83cd36c919a63a"],["/assets/img/posts/amazones_biodiversity-panel_xs.jpg","42b65ac5b98f748957738ad285b2a915"],["/assets/img/posts/amazones_timber-panel.jpg","9ea96226e9eb69d1916f3f0c105311c3"],["/assets/img/posts/amazones_timber-panel_goup.jpg","9ea96226e9eb69d1916f3f0c105311c3"],["/assets/img/posts/amazones_timber-panel_lg.jpg","9ea96226e9eb69d1916f3f0c105311c3"],["/assets/img/posts/amazones_timber-panel_md.jpg","9ea96226e9eb69d1916f3f0c105311c3"],["/assets/img/posts/amazones_timber-panel_placehold.jpg","547e14181ee36c84617fe769503e8bcc"],["/assets/img/posts/amazones_timber-panel_sm.jpg","c9a950cb5d6a03fbfca31a8a60db9fe8"],["/assets/img/posts/amazones_timber-panel_thumb.jpg","8007895beecb7af6b66e4206b06817ca"],["/assets/img/posts/amazones_timber-panel_thumb@2x.jpg","9ea96226e9eb69d1916f3f0c105311c3"],["/assets/img/posts/amazones_timber-panel_xs.jpg","c04c6e6658d211e1d395835ebdfb0b6b"],["/assets/img/posts/amazones_water.jpg","eba82bf1c12f985fc9afd0c26f675dba"],["/assets/img/posts/amazones_water_goup.jpg","eba82bf1c12f985fc9afd0c26f675dba"],["/assets/img/posts/amazones_water_lg.jpg","eba82bf1c12f985fc9afd0c26f675dba"],["/assets/img/posts/amazones_water_md.jpg","eba82bf1c12f985fc9afd0c26f675dba"],["/assets/img/posts/amazones_water_placehold.jpg","512407c7818d240c0115935d2a1ba214"],["/assets/img/posts/amazones_water_sm.jpg","32df92d8944d31194322d2e090eb4eaa"],["/assets/img/posts/amazones_water_thumb.jpg","a72c8013c8cad0207431cb8c88609cde"],["/assets/img/posts/amazones_water_thumb@2x.jpg","eba82bf1c12f985fc9afd0c26f675dba"],["/assets/img/posts/amazones_water_xs.jpg","f4e59115c70bba888762b5a1e47860e0"],["/assets/img/posts/areacategorical_getlegend-raw.jpg","021f68fa29d1ae2557f19f196141c9bd"],["/assets/img/posts/areacategorical_getlegend-raw_goup.jpg","021f68fa29d1ae2557f19f196141c9bd"],["/assets/img/posts/areacategorical_getlegend-raw_lg.jpg","021f68fa29d1ae2557f19f196141c9bd"],["/assets/img/posts/areacategorical_getlegend-raw_md.jpg","021f68fa29d1ae2557f19f196141c9bd"],["/assets/img/posts/areacategorical_getlegend-raw_placehold.jpg","de17ddf087c683c0af3fa2b6b6f6b8ea"],["/assets/img/posts/areacategorical_getlegend-raw_sm.jpg","41fca8294278485aea8d99dd538b55f4"],["/assets/img/posts/areacategorical_getlegend-raw_thumb.jpg","bfb4190da7ac1e46daa7cacd848ce647"],["/assets/img/posts/areacategorical_getlegend-raw_thumb@2x.jpg","021f68fa29d1ae2557f19f196141c9bd"],["/assets/img/posts/areacategorical_getlegend-raw_xs.jpg","f25b370fb993cc100aa30a92025e5422"],["/assets/img/posts/button-widget.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_goup.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_lg.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_md.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_placehold.jpg","87a7d060e664e1c81594700f50b1118a"],["/assets/img/posts/button-widget_sm.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_thumb.jpg","d3c64f354b2cad4e93b525cd15aef385"],["/assets/img/posts/button-widget_thumb@2x.jpg","caccfdc653de620f2b6c0f6369962af3"],["/assets/img/posts/button-widget_xs.jpg","7c80d8feade8b494a85675470cd97898"],["/assets/img/posts/combobox-widget.jpg","2c02c04193b6bbcfe8ff5259e996a995"],["/assets/img/posts/combobox-widget_goup.jpg","46e5cc4b7e713f81c160e11e97784d16"],["/assets/img/posts/combobox-widget_lg.jpg","2c02c04193b6bbcfe8ff5259e996a995"],["/assets/img/posts/combobox-widget_md.jpg","ed424abc495dff0a934d3a0ec1409ee1"],["/assets/img/posts/combobox-widget_placehold.jpg","6d38140f9e9b658084a0a5d525de772f"],["/assets/img/posts/combobox-widget_sm.jpg","aab4646a831a6e2417ca31933fcddc80"],["/assets/img/posts/combobox-widget_thumb.jpg","43a46dcfdad506ebf8d2c7c3f96e16a4"],["/assets/img/posts/combobox-widget_thumb@2x.jpg","cc50589fcf1752e99cd6b58702205c62"],["/assets/img/posts/combobox-widget_xs.jpg","66f786e792597b95a37b5cc571af38ab"],["/assets/img/posts/fip_cerrado_geral.jpg","9f29062cd0d10c956ad3fe5a2338e1f9"],["/assets/img/posts/fip_cerrado_geral_goup.jpg","9f29062cd0d10c956ad3fe5a2338e1f9"],["/assets/img/posts/fip_cerrado_geral_lg.jpg","9f29062cd0d10c956ad3fe5a2338e1f9"],["/assets/img/posts/fip_cerrado_geral_md.jpg","9f29062cd0d10c956ad3fe5a2338e1f9"],["/assets/img/posts/fip_cerrado_geral_placehold.jpg","c2450fa926beffcdb0e95bebf5f0a4bc"],["/assets/img/posts/fip_cerrado_geral_sm.jpg","28dcf257b7da9db44d81801624bbb095"],["/assets/img/posts/fip_cerrado_geral_thumb.jpg","b1df870dbf9a6e3bd34f07b59a48362b"],["/assets/img/posts/fip_cerrado_geral_thumb@2x.jpg","9f29062cd0d10c956ad3fe5a2338e1f9"],["/assets/img/posts/fip_cerrado_geral_xs.jpg","9ed97a9252145237cf14a3f5d77a3d0b"],["/assets/img/posts/hoverpixel-widget.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_goup.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_lg.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_md.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_placehold.jpg","ff4a234a4386e8d9aa1fb72109f2ecf5"],["/assets/img/posts/hoverpixel-widget_sm.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_thumb.jpg","956537e83743e1982e7389e72e35fa22"],["/assets/img/posts/hoverpixel-widget_thumb@2x.jpg","2de70551eaf7c9b803e3396bd05ad737"],["/assets/img/posts/hoverpixel-widget_xs.jpg","4ab69290228abb6482bdee4fa8f20fb6"],["/assets/img/posts/hoverpixel_hovering.jpg","ae7048d2f3b1852b6ab53fd2ca1ca4e9"],["/assets/img/posts/hoverpixel_hovering_goup.jpg","687b6c2b311796f62683ff6281551fc8"],["/assets/img/posts/hoverpixel_hovering_lg.jpg","ae7048d2f3b1852b6ab53fd2ca1ca4e9"],["/assets/img/posts/hoverpixel_hovering_md.jpg","1311612a6d6df6ed0212df4c02f4c9c1"],["/assets/img/posts/hoverpixel_hovering_placehold.jpg","8a7bcccaa4f3e24e15db47fa0f53bfce"],["/assets/img/posts/hoverpixel_hovering_sm.jpg","6cd4d23a3bcf61804a212faecbab0972"],["/assets/img/posts/hoverpixel_hovering_thumb.jpg","3b418d24a5012dea228ab44bec91c5e9"],["/assets/img/posts/hoverpixel_hovering_thumb@2x.jpg","37f7c6915fc3e57dc793569ef855ef6c"],["/assets/img/posts/hoverpixel_hovering_xs.jpg","087aee17146a76e40c1b5fda4f22e454"],["/assets/img/posts/hoverpixel_total_burned_area.jpg","3619467d5da83922d91872546c88d624"],["/assets/img/posts/hoverpixel_total_burned_area_goup.jpg","31b298a0c4303832867760b324cc22a4"],["/assets/img/posts/hoverpixel_total_burned_area_lg.jpg","3619467d5da83922d91872546c88d624"],["/assets/img/posts/hoverpixel_total_burned_area_md.jpg","9ca39811d2d0ac2e762319217e61979e"],["/assets/img/posts/hoverpixel_total_burned_area_placehold.jpg","b20cf93a174938886e42a7a230c6c31a"],["/assets/img/posts/hoverpixel_total_burned_area_sm.jpg","d7ed96729f10fa93d460bbcccaec42cc"],["/assets/img/posts/hoverpixel_total_burned_area_thumb.jpg","f66a6f89717464087388a1ae5cbd442a"],["/assets/img/posts/hoverpixel_total_burned_area_thumb@2x.jpg","75353438013def3833b38ed0141f3dac"],["/assets/img/posts/hoverpixel_total_burned_area_xs.jpg","bab23dd79df804cf5633e7c464210646"],["/assets/img/posts/inputmanager-widget.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_goup.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_lg.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_md.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_placehold.jpg","3eee74901e1726e2624b6e6a26d3d62c"],["/assets/img/posts/inputmanager-widget_sm.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_thumb.jpg","2a4d0a4a400a6ffe0e2f9094821adec0"],["/assets/img/posts/inputmanager-widget_thumb@2x.jpg","c1190970c5ce1b44bd9f5e401b5b1078"],["/assets/img/posts/inputmanager-widget_xs.jpg","b045934ef3609963d125340a30c9465c"],["/assets/img/posts/laurel_data_integration.jpg","6a38e1756ba2c82d9d3d5ed15ac72718"],["/assets/img/posts/laurel_data_integration_goup.jpg","6a38e1756ba2c82d9d3d5ed15ac72718"],["/assets/img/posts/laurel_data_integration_lg.jpg","6a38e1756ba2c82d9d3d5ed15ac72718"],["/assets/img/posts/laurel_data_integration_md.jpg","6a38e1756ba2c82d9d3d5ed15ac72718"],["/assets/img/posts/laurel_data_integration_placehold.jpg","76b6b37db254cdea20aa45539f327332"],["/assets/img/posts/laurel_data_integration_sm.jpg","723222952a54214b4252640c8d4703c8"],["/assets/img/posts/laurel_data_integration_thumb.jpg","12c4a7d35a2838b331699c27248529a1"],["/assets/img/posts/laurel_data_integration_thumb@2x.jpg","6a38e1756ba2c82d9d3d5ed15ac72718"],["/assets/img/posts/laurel_data_integration_xs.jpg","a1e21c11bdca2cdc0f56d35a3f180cf7"],["/assets/img/posts/laurel_landsim.jpg","b04381b1a9ce1bb5f9e5a688507eb91a"],["/assets/img/posts/laurel_landsim_goup.jpg","b04381b1a9ce1bb5f9e5a688507eb91a"],["/assets/img/posts/laurel_landsim_lg.jpg","b04381b1a9ce1bb5f9e5a688507eb91a"],["/assets/img/posts/laurel_landsim_md.jpg","b04381b1a9ce1bb5f9e5a688507eb91a"],["/assets/img/posts/laurel_landsim_placehold.jpg","39132a5cde093e860dab29ed82d9b4b9"],["/assets/img/posts/laurel_landsim_sm.jpg","9f0987ce23817e7ca10e9bca4926d0d4"],["/assets/img/posts/laurel_landsim_thumb.jpg","eb565dd4d498322b9c457f9e9d2d93db"],["/assets/img/posts/laurel_landsim_thumb@2x.jpg","b04381b1a9ce1bb5f9e5a688507eb91a"],["/assets/img/posts/laurel_landsim_xs.jpg","ba827ac9b334b03a183254c171f84874"],["/assets/img/posts/legend_opacityslider-widget.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_goup.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_lg.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_md.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_placehold.jpg","0dd022fa6cb3f4681d83feb91ed2f84a"],["/assets/img/posts/legend_opacityslider-widget_sm.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_thumb.jpg","dfdcbdf8018cff359b5f6ab6e493ba4a"],["/assets/img/posts/legend_opacityslider-widget_thumb@2x.jpg","633cc2773a10cd080888a18b946870d4"],["/assets/img/posts/legend_opacityslider-widget_xs.jpg","66fab177270724dea84d7cf5d2b538d4"],["/assets/img/posts/legendhtml_example.jpg","22e6c7eb5190c86b3fef7b2ee22e827e"],["/assets/img/posts/legendhtml_example_goup.jpg","3867c321e976c72d40d8e3d5fd35d04f"],["/assets/img/posts/legendhtml_example_lg.jpg","22e6c7eb5190c86b3fef7b2ee22e827e"],["/assets/img/posts/legendhtml_example_md.jpg","0fa3f312f97a20b3a34d90ba3a43b715"],["/assets/img/posts/legendhtml_example_placehold.jpg","32581a94a64afaf533e9f41edf20c72e"],["/assets/img/posts/legendhtml_example_sm.jpg","2d21ae72da9029515c81dfb2d9d57004"],["/assets/img/posts/legendhtml_example_thumb.jpg","67d129a6101951bd48dda465cc89ce47"],["/assets/img/posts/legendhtml_example_thumb@2x.jpg","dc58ce3d14adc81ff930d20f2cbb3e40"],["/assets/img/posts/legendhtml_example_xs.jpg","0f33215fd5c42474bb9170872c2ef8a1"],["/assets/img/posts/loadcsv-widget.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_goup.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_lg.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_md.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_placehold.jpg","7a3571b07429b81dd0686965935533c5"],["/assets/img/posts/loadcsv-widget_sm.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_thumb.jpg","8d4592519aea62b6e4c357d8f33ae10f"],["/assets/img/posts/loadcsv-widget_thumb@2x.jpg","7169da431a852f6bad545d0ca98b45ce"],["/assets/img/posts/loadcsv-widget_xs.jpg","5961bbe3d9fd0a9b8e0bb93c99fc2381"],["/assets/img/posts/loadjson-widget.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_goup.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_lg.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_md.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_placehold.jpg","da5a1af9c5af15d638b11811babe71cc"],["/assets/img/posts/loadjson-widget_sm.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_thumb.jpg","47e3c20dd27840ec9bc79488b5b3eedd"],["/assets/img/posts/loadjson-widget_thumb@2x.jpg","bdb6aaa809a4ae4bf577703f61c5eba8"],["/assets/img/posts/loadjson-widget_xs.jpg","82a1b43dda83c38cd69fbef592db7a80"],["/assets/img/posts/opcoesmitigacao-panel.jpg","95416390c3034025f2ea0df5977dae26"],["/assets/img/posts/opcoesmitigacao-panel_goup.jpg","95416390c3034025f2ea0df5977dae26"],["/assets/img/posts/opcoesmitigacao-panel_lg.jpg","95416390c3034025f2ea0df5977dae26"],["/assets/img/posts/opcoesmitigacao-panel_md.jpg","95416390c3034025f2ea0df5977dae26"],["/assets/img/posts/opcoesmitigacao-panel_placehold.jpg","095e6ae45333d25f0186a9b79708ac52"],["/assets/img/posts/opcoesmitigacao-panel_sm.jpg","d3f30d5e301910cf3caf4fc14b1f9bf2"],["/assets/img/posts/opcoesmitigacao-panel_thumb.jpg","d5eb6404058a77d1fdf4842749648cd1"],["/assets/img/posts/opcoesmitigacao-panel_thumb@2x.jpg","95416390c3034025f2ea0df5977dae26"],["/assets/img/posts/opcoesmitigacao-panel_xs.jpg","a2af29e19af8e70b309c4f64706c377f"],["/assets/img/posts/pickpoint-widget.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_goup.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_lg.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_md.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_placehold.jpg","036a4fe46f3dcdb6c04dea7c9c3825d5"],["/assets/img/posts/pickpoint-widget_sm.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_thumb.jpg","72cff220d8457d5ae038868e05f33a3c"],["/assets/img/posts/pickpoint-widget_thumb@2x.jpg","ada89d7903675f23ae933b3ab044e155"],["/assets/img/posts/pickpoint-widget_xs.jpg","6cb974fd5098aa055611fa91e1d52660"],["/assets/img/posts/slider-widget.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_goup.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_lg.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_md.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_placehold.jpg","f0fee8238e859f289909f09aabe505f2"],["/assets/img/posts/slider-widget_sm.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_thumb.jpg","b4fe010d0a41c76ee48c392fe116535a"],["/assets/img/posts/slider-widget_thumb@2x.jpg","dba8d47879eb19d52f949e36f5ea93b1"],["/assets/img/posts/slider-widget_xs.jpg","e9ce777e19fd69ecb208f9e88d530823"],["/assets/img/posts/textfield-widget.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_goup.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_lg.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_md.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_placehold.jpg","1995c4ca172a6100503cf7a441c05209"],["/assets/img/posts/textfield-widget_sm.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_thumb.jpg","27e9d17396fb50b2fb055d13956d1202"],["/assets/img/posts/textfield-widget_thumb@2x.jpg","6b143a11111a83f06ed7b41a40671e49"],["/assets/img/posts/textfield-widget_xs.jpg","1fc0201758427f0f4032ab1c22117ad5"],["/assets/img/posts/timeline-panel.jpg","38f0be09c08e85d55d90fde0c9f402a3"],["/assets/img/posts/timeline-panel_goup.jpg","38f0be09c08e85d55d90fde0c9f402a3"],["/assets/img/posts/timeline-panel_lg.jpg","38f0be09c08e85d55d90fde0c9f402a3"],["/assets/img/posts/timeline-panel_md.jpg","38f0be09c08e85d55d90fde0c9f402a3"],["/assets/img/posts/timeline-panel_placehold.jpg","572d8f5f898df3b0b1cf770b9f768f71"],["/assets/img/posts/timeline-panel_sm.jpg","d11496eb5e1d5810061738761c7fbb66"],["/assets/img/posts/timeline-panel_thumb.jpg","700a05cbfe53d740ebff93571a9f73c8"],["/assets/img/posts/timeline-panel_thumb@2x.jpg","38f0be09c08e85d55d90fde0c9f402a3"],["/assets/img/posts/timeline-panel_xs.jpg","58595955be9b6e5f11999a287a37c933"],["/assets/img/posts/uso_do_solo_recursos_hidricos.jpg","95f2fe41e4fe3ed65bb78b2ea3fde375"],["/assets/img/posts/uso_do_solo_recursos_hidricos_goup.jpg","95f2fe41e4fe3ed65bb78b2ea3fde375"],["/assets/img/posts/uso_do_solo_recursos_hidricos_lg.jpg","95f2fe41e4fe3ed65bb78b2ea3fde375"],["/assets/img/posts/uso_do_solo_recursos_hidricos_md.jpg","95f2fe41e4fe3ed65bb78b2ea3fde375"],["/assets/img/posts/uso_do_solo_recursos_hidricos_placehold.jpg","f4e4587ec902c30fb91328159e3f9c54"],["/assets/img/posts/uso_do_solo_recursos_hidricos_sm.jpg","5e266351eee8add00c99c6de28892f30"],["/assets/img/posts/uso_do_solo_recursos_hidricos_thumb.jpg","dac94cbd73b58f27ce15d56357da9088"],["/assets/img/posts/uso_do_solo_recursos_hidricos_thumb@2x.jpg","95f2fe41e4fe3ed65bb78b2ea3fde375"],["/assets/img/posts/uso_do_solo_recursos_hidricos_xs.jpg","7996b9865bcff301c93d068eade09842"],["/assets/js/alertify.min.js","4b92e632306b308d628b73ad45c14376"],["/assets/js/asyncloader.min.js","a176c26a399362e379e54dc65f7aa179"],["/assets/js/bundle.js","0193d3d2a1f5c4e84b53ea5ecb3c06d2"],["/assets/js/video.min.js","2914cb3f003831abbf7795a4a26e919d"],["/contact/index.html","9fe925422bce96934f13a8914c3f7683"],["/documentation/index.html","c391b76a7455f194eeb36725f2445419"],["/elements/button-widget/index.html","06ee2074cd51c42c4c692bde9e478110"],["/elements/combobox-widget/index.html","3b0eeb3bfcb05bfe943c1de3511d3dcb"],["/elements/hoverpixel-widget/index.html","00f56cb31fffd5a6d168123176e1fd48"],["/elements/inputmanager-widget/index.html","4b0c462c33eb8be7402a7ceedc966de6"],["/elements/legend_opacityslider-widget/index.html","eae83b0f4a6485b51cf4f8ac4613fdae"],["/elements/loadcsv-widget/index.html","eeeacd8b2b71a1997f5ac77c4a00f716"],["/elements/loadjson-widget/index.html","642d3dd5715e233d1bc614b6ed65f8ff"],["/elements/pickpoint-widget/index.html","cd0b05ac5444c7c6139dc1f30d1b2134"],["/elements/slider-widget/index.html","cfe75d9562d5faa94b7c87cf6a5be527"],["/elements/textfield-widget/index.html","fc96268cfa573f21f9c6fc923695c2ba"],["/elements/timeline-panel/index.html","9de0e3b7853bfe7e470714523fc4cd38"],["/examples/amazones-economic_valuation/index.html","60e3ba80d13f71fbf361f1ff91db96ec"],["/examples/amazones-timber/index.html","a705f06df482000f54ae2a84bda0bf61"],["/examples/amazones_biodiversity/index.html","af162b5196bdb3e95b4d6dd60428b1e9"],["/examples/amazones_water/index.html","cdb23375ad29628cb21e5eb0c5d5bf8d"],["/examples/data_showcase/index.html","4c5fd4650530b488c60b5b4e4fe4fe75"],["/examples/fip_cerrado_geral/index.html","6d7c3a00a846c5de988a5a1e9febeee3"],["/examples/opcoesdemitigacao/index.html","ea558b595c64f9b680a5d636dcc8777f"],["/examples/uso_do_solo_recursos_hidricos/index.html","0def2d9b37964bbe31cec938d2d505f8"],["/gulpfile.babel.js","d3a1c6d57f32f4b20c518a522b2ef4a6"],["/index.html","2dbbf45de132279d1b7e6ec75772d927"],["/mappia_publisher/index.html","c686cad7fe28828cc31c56823463096b"],["/raw_maps/areacategorical_getlegend-wrm/index.html","b743e736dbc31453cff5de548cdcb091"],["/raw_maps/areaintegral_summedarea-wrm/index.html","a4d07ca396f8d65515000e1875a90937"],["/sw.js","a58a559418ed0c0c8f1a1667db07837c"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







