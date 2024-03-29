import { A, FloatingMenu, useInternalNavigate } from 'lwt-ui-kit';
import { FooterInfo } from '../../../../../LWT-UI-Kit/src/FooterInfo';
import { InfoLine } from '../../../../../LWT-UI-Kit/src/InfoLine';
import { useSmoothScrollOnHashChange } from '../../../../../LWT-UI-Kit/src/hooks/useSmoothScrollOnHashChange';

const infoLines: Parameters<typeof InfoLine>[0][] = [
  { title: 'Preface', href: 'preface' },
  { title: 'Current Version', href: 'current' },
  { title: 'Links', href: 'links' },
  { title: 'Abstract', href: 'abstract' },
  { title: 'Features', href: 'features' },
  { title: 'Restrictions', href: 'restrictions' },
  { title: '(Un-) License', href: 'license' },
  { title: 'Disclaimer', href: 'disclaimer' },
  { title: 'Installation', href: 'install' },
  { title: 'How to learn', href: 'learn' },
  { title: 'How to use', href: 'howto' },
  { title: 'Questions and Answers', href: 'faq' },
  { title: 'Setup for Tablets', href: 'ipad' },
  { title: 'Language Setup', href: 'langsetup' },
  { title: 'Term Scores', href: 'termscores' },
  { title: 'Key Bindings', href: 'keybind' },
  { title: 'Changelog', href: 'history' },
];

export function InfoPage() {
  const navigator = useInternalNavigate();
  useSmoothScrollOnHashChange();
  return (
    <body>
      <FloatingMenu menuOptions={infoLines} />
      <div style={{ marginRight: '100px' }}>
        <h4>
          <A href="/" target="_top">
            <img
              src="img/lwt_icon_big.png"
              className="lwtlogoright"
              alt="Logo"
            />
            Learning with Texts
          </A>
          <br />
          <br />
          <span className="bigger">Help/Information</span>
        </h4>

        <p className="inline">
          Jump to topic:
          <select
            id="topicjump"
            onChange={({ target: { value, blur } }) => {
              if (value !== '-1') {
                navigator('#' + value, true);
                // To avoid up/down changing this value after change
                // TODO not working
                blur();
                return;
              }
              navigator('', true);
            }}
          >
            <option value="-1" selected>
              [Select...]
            </option>
            <option value="preface">Preface</option>
            <option value="current">Current Version</option>
            <option value="links">Links</option>
            <option value="abstract">Abstract</option>
            <option value="features">Features</option>
            <option value="restrictions">Restrictions</option>
            <option value="license">(Un-) License</option>
            <option value="disclaimer">Disclaimer</option>
            <option value="install">Installation</option>
            <option value="learn">How to learn</option>
            <option value="howto">How to use</option>
            <option value="faq">Questions and Answers</option>
            <option value="ipad">Setup for Tablets</option>
            <option value="langsetup">Language Setup</option>
            <option value="termscores">Term Scores</option>
            <option value="keybind">Key Bindings</option>
            <option value="history">Changelog</option>
          </select>
        </p>

        <dl>
          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="preface">Preface</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                I started this software application in 2010 as a hobby project
                for my personal learning (reading & listening to foreign texts,
                saving & reviewing new words and expressions).
              </li>

              <li>
                In June 2011, I decided to publish the software in the hope that
                it will be useful to other language learners around the world.
              </li>

              <li>
                The software is 100 % free, open source, and in the public
                domain. You may do with it what you like: use it, improve it,
                change it, publish an improved version, even use it within a
                commercial product.
              </li>

              <li>
                English is not my mother tongue - so please forgive me any
                mistakes.
              </li>

              <li>
                A piece of software will be never completely free of "bugs" -
                please inform me of any problem you will encounter. Your
                feedback and ideas are always welcome.
              </li>

              <li>
                My programming style is quite chaotic, and my software is mostly
                undocumented. This will annoy people with much better
                programming habits than mine, but please bear in mind that LWT
                is a one-man hobby project and completely free.
              </li>

              <li>
                Thank you for your attention. I hope you will enjoy this
                application as I do every day.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="current">Current Version</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                The current version is <b>2.0.3</b> (February 15 2022).
              </li>

              <li>
                {' '}
                <a href="#history">View the Changelog.</a>{' '}
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="links">Important Links</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                {' '}
                <a
                  href="http://sourceforge.net/projects/learning-with-texts/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Project Page</b> @ Sourceforge
                </a>{' '}
              </li>

              <li>
                {' '}
                <a
                  href="http://sourceforge.net/projects/learning-with-texts/files/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Download Page</b> @ Sourceforge
                </a>{' '}
                <br />
                <br />
              </li>

              {/* <!-- */}
              <li>
                {' '}
                <a
                  href="http://sourceforge.net/projects/lwt/forums/forum/1813497"
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Help Forum</b> @ Sourceforge
                </a>{' '}
                <br />
                <br />
              </li>
              {/* --> */}
              <li>
                <b>LWT Online Demo</b> -<b>try it out:</b>
                <ul>
                  <li>
                    <b>General Hints:</b>
                    <ul>
                      <li>Do not use for productive work!!</li>
                      <li>
                        Your data may be deleted at any time by other users!!
                      </li>
                      <li>
                        Only one LWT table set is available - the multiple table
                        set feature has been deactivated.
                      </li>
                      <li>
                        You may "reset" the demo by going to "Backup/Restore",
                        and by clicking on "Install LWT Demo Database".
                      </li>
                    </ul>
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://learning-with-texts.sourceforge.io/testdb/index"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <b>START ONLINE DEMO</b>
                    </a>{' '}
                  </li>
                </ul>
                <br />
              </li>

              <li>
                <b>LWT Reviews and Blog Posts</b>
                <ul>
                  <li>
                    {' '}
                    <a
                      href="https://www.mezzoguild.com/how-to-install-learning-with-texts-lwt/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      The Mezzofanti Guild: How To Install Learning With Texts
                      On Your Own Computer
                    </a>{' '}
                  </li>
                  <li>
                    Street-Smart Language Learning™: Using Learning with Texts
                    with Anki 2 (in five parts):
                    <br />
                    Part{' '}
                    <a
                      href="http://www.streetsmartlanguagelearning.com/2012/12/using-learning-with-texts-with-anki-2.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      1
                    </a>{' '}
                    /{' '}
                    <a
                      href="http://www.streetsmartlanguagelearning.com/2013/01/using-learning-with-texts-with-anki-2.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      2
                    </a>{' '}
                    /{' '}
                    <a
                      href="http://www.streetsmartlanguagelearning.com/2013/01/using-learning-with-texts-with-anki-2_8.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      3
                    </a>{' '}
                    /{' '}
                    <a
                      href="http://www.streetsmartlanguagelearning.com/2013/01/using-learning-with-texts-with-anki-2_15.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      4
                    </a>{' '}
                    /{' '}
                    <a
                      href="http://www.streetsmartlanguagelearning.com/2013/01/using-learning-with-texts-with-anki-2_21.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      5
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://diyclassics.com/2014/04/11/learning-with-texts-for-classical-languages/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learning with Texts for classical languages
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://chicagoseoul.wordpress.com/2011/07/19/learning-with-texts/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Chicagoseoul's Blog: Learning with Texts
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://mikotoneko.wordpress.com/2012/03/09/lwtp1/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mikoto's Adventures in Japanese: LWT - Learning With Text
                      Introduction
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://mikotoneko.wordpress.com/2012/03/13/lwt-a-guide-to-setting-up-for-japanese-learning/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mikoto's Adventures in Japanese: LWT - A Guide to Setting
                      up for Japanese Learning
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://mikotoneko.wordpress.com/2012/04/06/lwt-tricks-of-the-trade/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mikoto's Adventures in Japanese: LWT - Tricks of the Trade
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://mikotoneko.wordpress.com/2012/04/17/lwt-daniels-guide-for-japanese-useage/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mikoto's Adventures in Japanese: LWT - Daniel’s Guide for
                      Japanese Usage
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      target="_blank"
                      href="http://www.youtube.com/watch?v=QSLPOATWAU4"
                      rel="noreferrer"
                    >
                      Video about Learning With Texts from Language Vlogger
                      FluentCzech
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://www.fluentin3months.com/learning-with-texts/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Fluent In 3 Months: Introducing LWT
                    </a>{' '}
                    <br />
                  </li>
                </ul>
                <br />
              </li>

              <li>
                <b>LWT Forum Threads</b>
                <ul>
                  <li>
                    {' '}
                    <a
                      href="http://how-to-learn-any-language.com/forum/forum_posts.asp?TID=28312&PN=1&TPN=1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      How-To-Learn-Any-Language Forum Thread about LWT
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://forum.language-learners.org/viewtopic?f=19&t=1993"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sites/Apps like Readlang, Lingq, Lingua.ly, etc.
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://forum.language-learners.org/viewtopic?f=19&t=5648"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Best dictionaries for use with LWT?
                    </a>{' '}
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://forum.language-learners.org/viewtopic?f=19&t=7156"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Getting the most out of LWT
                    </a>{' '}
                  </li>
                  <br />
                </ul>
              </li>
              <li>
                <b>Additional Resources</b>
                <ul>
                  <li>
                    Similar software or services
                    <ul>
                      <li>
                        {' '}
                        <a
                          href="https://sourceforge.net/projects/foreign-language-text-reader/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          FLTR - Foreign Language Text Reader
                        </a>{' '}
                        (Open Source Java Desktop Application).
                      </li>
                      <li>
                        {' '}
                        <a
                          href="http://lingq.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          LingQ.com
                        </a>{' '}
                        (Web based service with tutoring. An account costs US$
                        10 per month).
                      </li>
                      <li>
                        {' '}
                        <a
                          href="http://lingro.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          lingro.com
                        </a>{' '}
                        (An on-line environment that allows anyone learning a
                        language to quickly look up and learn the vocabulary).
                      </li>
                      <li>
                        {' '}
                        <a
                          href="http://readlang.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          readlang.com
                        </a>{' '}
                        (An on-line service where you can import articles, read
                        and translate them, and learn new words. Price: US$ 5
                        per month or US$ 48 per year).
                      </li>
                    </ul>
                  </li>
                  <li>
                    Resources for various languages
                    <ul>
                      <li>
                        {' '}
                        <a
                          href="http://tinyurl.com/cbpndlt"
                          target="_blank"
                          rel="noreferrer"
                        >
                          GoogleDocs Spreadsheet
                        </a>{' '}
                        with recommendations for LWT Language Settings
                        ("Templates")
                        <br />
                        <b>Important:</b> Please be careful when making
                        additions or corrections!
                      </li>
                    </ul>
                  </li>
                  <li>
                    For learners of Japanese
                    <ul>
                      <li>
                        {' '}
                        <a
                          href="http://taku910.github.io/mecab/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          MeCab - Yet Another Part-of-Speech and Morphological
                          Analyzer
                        </a>{' '}
                      </li>
                    </ul>
                  </li>
                  <li>
                    For learners of Chinese
                    <ul>
                      <li>
                        {' '}
                        <a
                          href="https://github.com/fxsjy/jieba"
                          target="_blank"
                          rel="noreferrer"
                        >
                          "Jieba" Chinese text segmentation
                        </a>{' '}
                        (
                        <a
                          href="https://www.python.org/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Python
                        </a>{' '}
                        needed). Usage: Download, unzip, run:
                        <i>
                          python -m jieba -d '&nbsp;' input.txt &gt;output.txt
                        </i>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="abstract">Abstract</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                {' '}
                <a
                  href="http://sourceforge.net/projects/learning-with-texts/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i>Learning with Texts</i> (LWT)
                </a>{' '}
                is a tool for Language Learning, inspired by:
                <ul>
                  <li>
                    {' '}
                    <a
                      href="http://sdkrashen.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Stephen Krashen's
                    </a>{' '}
                    principles in Second Language Acquisition,
                  </li>

                  <li>
                    Steve Kaufmann's{' '}
                    <a href="http://lingq.com" target="_blank" rel="noreferrer">
                      LingQ
                    </a>{' '}
                    System and
                  </li>

                  <li>
                    ideas from Khatzumoto, published at{' '}
                    <a
                      href="http://www.alljapaneseallthetime.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      "AJATT - All Japanese All The Time"
                    </a>
                    .
                  </li>
                </ul>
              </li>

              <li>
                You define languages you want to learn and import texts you want
                to use for learning.
              </li>

              <li>
                While listening to the audio (optional), you read the text,
                save, review and test "terms" (words or multi word expressions,
                2 to 9 words).
              </li>

              <li>
                In new texts all your previously saved words and expressions are
                displayed according to their current learn statuses, tooltips
                show translations and romanizations (readings), editing,
                changing the status, dictionary lookup, etc. is just a click
                away.
              </li>

              <li>
                Import of terms in TSV/CSV format, export in TSV format, and
                export to{' '}
                <a href="http://ankisrs.net" target="_blank" rel="noreferrer">
                  Anki
                </a>{' '}
                (prepared for cloze tests), are also possible.
                <br />
                <br />
              </li>

              <li>
                <b>
                  <u>MOST IMPORTANT:</u>
                  <br />
                  <br /> To run LWT, you'll need:
                </b>
                <br />
                <br />
                <b>(1) A modern web browser.</b>
                <br />I recommend (in this order)
                <ul>
                  <li>
                    {' '}
                    <a
                      href="http://www.google.com/chrome/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Chrome
                    </a>
                    ,
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://www.mozilla.org/firefox/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Firefox
                    </a>
                    ,
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://www.apple.com/safari/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Safari
                    </a>
                    , or
                  </li>
                  <li>
                    {' '}
                    <a
                      href="https://www.microsoft.com/en-us/windows/microsoft-edge"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Microsoft Edge
                    </a>
                    .
                  </li>
                </ul>
                <br />
                <b>(2) A local web server.</b>
                <br />
                An easy way to install a local web server are preconfigured
                packages like
                <ul>
                  <li>
                    {' '}
                    <a
                      href="http://www.easyphp.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      EasyPHP
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://www.apachefriends.org/download.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      XAMPP
                    </a>{' '}
                    (Windows), or
                  </li>
                  <li>
                    {' '}
                    <a
                      href="http://mamp.info/en/index.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      MAMP
                    </a>{' '}
                    (macOS), or
                  </li>
                  <li>
                    a{' '}
                    <a
                      href="http://en.wikipedia.org/wiki/LAMP_%28software_bundle%29"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LAMP (Linux-Apache-MySQL-PHP) server
                    </a>{' '}
                    (Linux).
                  </li>
                </ul>
                <br />
                <b>(3) The LWT Application.</b>
                <br />
                The ZIP Archive <i>lwt_v_x_y.zip</i> can be downloaded{' '}
                <a
                  href="http://sourceforge.net/projects/learning-with-texts/files/"
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
                .
                <br />
                The installation is explained <a href="#install">here</a> .
                <br />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="features">Features</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>You define languages you want to learn.</li>

              <li>You define the web dictionaries you want to use.</li>

              <li>
                You define how sentences and words in the language will be split
                up.
              </li>

              <li>
                You upload texts, and they are automatically split into
                sentences and words! Later re-parsing is possible.
              </li>

              <li>
                Optional: Assign the URL of an mp3 audio file of the text
                (Dropbox, local server, ...) in order to listen while reading
                the text.
              </li>

              <li>
                You read the text while listening to the audio, and you see
                immediately the status of every word (unknown, learning,
                learned, well-known, ignored).
              </li>

              <li>
                You click on words, and you use the external dictionaries to
                find out their meanings.
              </li>

              <li>
                You save words or expressions (2..9 words) with optional
                romanization (for asiatic languages), translations and example
                sentence, you change its status, you edit them whenever needed
                (like in LingQ).
              </li>

              <li>
                You test your understanding of words and expressions within or
                without sentence context.
              </li>

              <li>
                MCD (Massive-Context Cloze Deletion) testing, as proposed by
                Khatzumoto @ AJATT, built-in!
              </li>

              <li>See your progress on the statistics page.</li>

              <li>
                You may export the words and expressions and use them in Anki or
                other programs.
              </li>

              <li>
                You may upload words and expressions into LWT (from LingQ or
                other sources, CSV/TSV) - they are immediately available in all
                texts!
              </li>

              <li>
                <b>New since Version 1.5.0:</b> Create and edit an improved
                annotated text version (a{' '}
                <a
                  target="_blank"
                  href="http://learnanylanguage.wikia.com/wiki/Hyperliteral_translations"
                  rel="noreferrer"
                >
                  hyperliteral translation
                </a>{' '}
                as{' '}
                <a
                  target="_blank"
                  href="http://en.wikipedia.org/wiki/Interlinear_gloss"
                  rel="noreferrer"
                >
                  interlinear text
                </a>{' '}
                ) for online or offline learning. Read more{' '}
                <a href="#il">here</a> .
              </li>

              <li>
                The application is 100 % free, open source, and in the Public
                Domain. Do with it what you like!
              </li>

              <li>
                Prerequisites: a local webserver (Apache, PHP, mySQL), e.g.
                EasyPHP or XAMPP (Windows), MAMP (macOS), or a LAMP server
                (Linux).
              </li>

              <li>Enjoy your language learning!</li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="restrictions">Restrictions</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                Texts and vocabulary terms with Unicode characters outside the{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane"
                  target="_blank"
                  rel="noreferrer"
                >
                  Basic Multilingual Plane
                </a>{' '}
                (BMP; U+0000 to U+FFFF), i.e. with Unicode characters U+10000
                and higher, are not supported. Therefore, characters for almost
                all modern languages, and a large number of symbols, are
                supported; but historic scripts, certain symbols and notations,
                and Emojis are not supported.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="license">(Un-) License</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                {' '}
                <a
                  href="http://sourceforge.net/projects/learning-with-texts/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i>"Learning with Texts"</i> (LWT)
                </a>{' '}
                is free and unencumbered software released into the PUBLIC
                DOMAIN.
                <br />
                Anyone is free to copy, modify, publish, use, compile, sell, or
                distribute this software, either in source code form or as a
                compiled binary, for any purpose, commercial or non-commercial,
                and by any means.
                <br />
                In jurisdictions that recognize copyright laws, the author or
                authors of this software dedicate any and all copyright interest
                in the software to the public domain. We make this dedication
                for the benefit of the public at large and to the detriment of
                our heirs and successors. We intend this dedication to be an
                overt act of relinquishment in perpetuity of all present and
                future rights to this software under copyright law.
                <br />
                Please read also the <a href="#disclaimer">disclaimer</a> .
                <br />
                For more information, please refer to{' '}
                <a
                  href="http://unlicense.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  http://unlicense.org/
                </a>
                .
                <br />
                <br />
              </li>

              <li>
                The following software packages, bundled within the LWT
                software, have different licenses:
                <ul>
                  <li>
                    jQuery, jQueryUI - Copyright © John Resig et.al.,{' '}
                    <a
                      href="http://jquery.org/license"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://jquery.org/license
                    </a>{' '}
                    (js/jquery.js, js/jquery-ui.min.js)
                  </li>

                  <li>
                    jQuery.ScrollTo - Copyright © Ariel Flesler,{' '}
                    <a
                      href="http://flesler.blogspot.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://flesler.blogspot.com
                    </a>{' '}
                    (js/jquery.scrollTo.min.js)
                  </li>

                  <li>
                    Jeditable - jQuery in-place edit plugin - Copyright © Mika
                    Tuupola, Dylan Verheul,{' '}
                    <a
                      href="http://www.appelsiini.net/projects/jeditable"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.appelsiini.net/projects/jeditable
                    </a>{' '}
                    (js/jquery.jeditable.mini.js)
                  </li>

                  <li>
                    jQueryUI Tag-it! - Copyright © Levy Carneiro Jr.,{' '}
                    <a
                      href="http://aehlke.github.com/tag-it/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://aehlke.github.com/tag-it/
                    </a>{' '}
                    (js/tag-it.js)
                  </li>

                  <li>
                    оverLIB 4.22 - Copyright © Erik Bоsrup,{' '}
                    <a
                      href="http://www.bosrup.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.bosrup.com/
                    </a>{' '}
                    (js/overlib/...)
                  </li>

                  <li>
                    sorttable - Copyright © Stuart Langridge,{' '}
                    <a
                      href="http://www.kryogenix.org/code/browser/sorttable/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.kryogenix.org/code/browser/sorttable/
                    </a>{' '}
                    (js/sorttable/...)
                  </li>

                  <li>
                    CountUp - Copyright © Praveen Lobo,{' '}
                    <a
                      href="http://PraveenLobo.com/techblog/javascript-countup-timer/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://PraveenLobo.com/techblog/javascript-countup-timer/
                    </a>{' '}
                    (js/countuptimer.js)
                  </li>

                  <li>
                    jPlayer - Copyright © Happyworm Ltd,{' '}
                    <a
                      href="http://www.jplayer.org/about/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.jplayer.org/about/
                    </a>{' '}
                    (js/jquery.jplayer.min.js, js/Jplayer.swf,
                    css/jplayer_skin/...)
                  </li>

                  <li>
                    Floating Menu - Copyright © JTricks.com,{' '}
                    <a
                      href="http://www.jtricks.com/licensing.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.jtricks.com/licensing.html
                    </a>{' '}
                    (js/floating.js)
                  </li>

                  <li>
                    mobiledetect - Copyright © Șerban Ghiță & Victor Stanciu,{' '}
                    <a
                      href="http://mobiledetect.net/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://mobiledetect.net
                    </a>{' '}
                    (php-mobile-detect/Mobile_Detect)
                  </li>

                  <li>
                    iUI - Copyright © iUI,{' '}
                    <a
                      href="http://www.iui-js.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://www.iui-js.org/
                    </a>{' '}
                    (iui)
                  </li>
                </ul>
                <br />
              </li>

              <li>
                The icons in the "icn" subdirectory are Copyright ©{' '}
                <a
                  href="http://p.yusukekamiyamane.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Yusuke Kamiyamane
                </a>
                . All rights reserved. Licensed under a{' '}
                <a
                  href="http://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Creative Commons Attribution 3.0 license
                </a>
                . The wizard icon "wizard.png" is the "Free Wizard Icon", free
                for commercial use, from{' '}
                <a
                  href="http://www.icojam.com/blog/?p=159"
                  target="_blank"
                  rel="noreferrer"
                >
                  icojam.com
                </a>{' '}
                (Author:{' '}
                <a
                  href="http://www.icojam.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  IcoJam / Andrew Zhebrakov
                </a>{' '}
                ).
                <br />
                <br />
              </li>

              <li>
                The following examples, supplied within the LWT download
                package, have the following licenses:
                <ul>
                  <li>
                    Chinese: The Man and the Dog - Copyright © Praxis Language
                    LLC, now ChinesePod Ltd.,{' '}
                    <a
                      href="http://chinesepod.com/lessons/the-man-and-the-dog"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                    , MP3 licensed under a{' '}
                    <a
                      href="http://creativecommons.org/licenses/by/3.0/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Creative Commons 3.0 Unported license
                    </a>
                    .
                  </li>

                  <li>
                    German: Die Leiden des jungen Werther by Johann Wolfgang von
                    Goethe - in the{' '}
                    <a
                      href="http://www.gutenberg.org/wiki/Gutenberg:The_Project_Gutenberg_License"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Public Domain
                    </a>
                    , Source:{' '}
                    <a
                      href="http://www.gutenberg.org/ebooks/2407"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Text
                    </a>
                    ,{' '}
                    <a
                      href="http://www.gutenberg.org/ebooks/19794"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Audio
                    </a>
                    .
                  </li>

                  <li>
                    French: Mon premier don du sang - Copyright © France
                    Bienvenue,{' '}
                    <a
                      href="http://francebienvenue1.wordpress.com/2011/06/18/generosite/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source
                    </a>
                    . License: "Bien sûr, les enseignants de FLE peuvent
                    utiliser nos enregistrements et nos transcriptions pour
                    leurs cours. Merci de mentionner notre site !".
                  </li>

                  <li>
                    Korean, Japanese, Thai, Hebrew - own creations from
                    different sources.
                  </li>
                </ul>
              </li>
            </ul>
          </dd>

          <dt>
            ▶
            <b>
              {' '}
              <a id="disclaimer">Disclaimer</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY
                CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="install">Installation on MS Windows, macOS, Linux</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                {' '}
                <a
                  target="_blank"
                  href="http://learning-with-texts.sourceforge.io/LWT_INSTALLATION.txt"
                  rel="noreferrer"
                >
                  Please follow the up-to-date instructions
                  <b>
                    <u>
                      <span className="bigger">HERE</span>
                    </u>
                  </b>
                  (you must be online!).
                </a>{' '}
                <br />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="learn">How to learn with LWT</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                Find an interesting text (preferably with an mp3 audio file) in
                the Internet and load it into LWT. If you are a beginner, look
                for beginner courses or podcasts in the Internet.
              </li>
              <li>
                You don't know where to find texts with audio? The{' '}
                <a href="http://lingq.com" target="_blank" rel="noreferrer">
                  LingQ Library
                </a>{' '}
                has many (only a free registration is needed). Or look into{' '}
                <a
                  href="https://www.lingq.com/en/forum/updates-tips-and-known-issues/where-to-find-good-content-to-import/"
                  target="_blank"
                  rel="noreferrer"
                >
                  this thread
                </a>{' '}
                in the LingQ Forum, you will find there lots of great links to
                resources. Or click (within the LingQ library) on "My Imports" -
                you will find a list of links of "Suggested resources".
              </li>
              <li>
                Read the text, look up the new words and expressions (=terms)
                and save them for review and test.
              </li>
              <li>
                The good thing with LWT: Every saved term will show up with its
                translation, status, etc. in all other occurrences of the same
                text and every other text! So you'll see immediately what you
                already know and how well you know it. And of course you'll see
                what you don't know!
              </li>
              <li>
                Load the MP3 file also on your portable MP3 player and listen to
                it often.
              </li>
              <li>
                Review (by reading again) or test your saved words and
                expressions.
                <br />
                <br />
              </li>
              <li>
                Listen ▶ Read ▶ Review/Test.
                <br />
                Listen ▶ Read ▶ Review/Test.
                <br />
                ......
                <br />
                <br />
              </li>
              <li>That's it. It's that simple. </li>
              <li>
                If you want to know more, watch{' '}
                <a
                  href="http://www.youtube.com/user/lingosteve"
                  target="_blank"
                  rel="noreferrer"
                >
                  Steve Kaufmann's videos on YouTube
                </a>
                : "The 7 secrets of language learning", "Language learning FAQ",
                and many more.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="howto">How to use</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                <b>LWT home screen after installation</b>
                <br />
                <br />
                This is home screen of LWT if the database is empty. Please
                install the demo database or start with the definition of a
                language you want to learn.
                <br />
                <br />
                <img className="grayborder" src="img/23.jpg" alt="Image" />
                <br />
                <br />
              </li>
              <li>
                <b>LWT home screen</b>
                <br />
                <br />
                This is normal home screen of LWT. You may choose a language
                here, but you can do this also later. If you you choose a
                language, the language filter is pre-set to that language in
                some other screens. The last text you've read or tested is
                shown, and you may jump directly into reading, testing or
                printing of this last text.
                <br />
                <br />
                <img className="grayborder" src="img/01.jpg" alt="Image" />
                <br />
                <br />
              </li>
              <li>
                <b>My Languages</b>
                <br />
                <br />
                The list of languages. Here you can add a new or edit an
                existent language. If no texts and no saved terms in a language
                exist, you can delete a language. If you change a language, all
                texts may be be automatically reparsed to refresh (and correct)
                the cache of sentences and text items (depends on what language
                settings you have changed). You can do this also manually by
                clicking on the yellow flash icon. You can also test all (due)
                terms of a language or set a language as "current" language.
                <br />
                <br />
                <img className="grayborder" src="img/02.jpg" alt="Image" />
                <br />
                <br />
              </li>
              <li>
                <b>
                  {' '}
                  <a id="howtolang">New/Edit Language</a>{' '}
                </b>{' '}
                <a id="go1">&nbsp;</a> <br />
                <br />
                This is the place to define or edit a language you want to
                study.
                <br />
                <br />
                <b>
                  If you are new to the system, use the "Language Settings
                  Wizard" first.
                </b>
                You only select your native (L1) and study (L2) languages, and
                let the wizard set all language settings that are marked in
                yellow. You can always adjust the settings afterwards.
                <br />
                <br />
                <b>Explainations of the input fields</b> - please read also{' '}
                <a href="#langsetup">this section</a> :
                <br />
                <br />
                <ul>
                  <li>
                    The three Uniform Resource IDentifiers (
                    <a
                      href="http://en.wikipedia.org/wiki/Uniform_Resource_IDentifier"
                      target="_blank"
                      rel="noreferrer"
                    >
                      URIs
                    </a>{' '}
                    ) are URIs to three web dictionaries (the second and third
                    is optional). Use ### as a placeholder for the searchword in
                    the URIs. If ### is missing, the searchword will be
                    appended. If the URI to query "travailler" in WordReference
                    is "http://www.wordreference.com/fren/travailler", you
                    enter: "http://www.wordreference.com/fren/###" or
                    "http://www.wordreference.com/fren/". Another example: The
                    URI to query "travailler" in sansagent is
                    "http://dictionary.sensagent.com/travailler/fr-en/", so you
                    enter in LWT "http://dictionary.sensagent.com/###/fr-en/".
                    <br /> <br />
                    As URI No. 3 ("Google Translate URI") is also used to
                    translate whole sentences, I would recommend to enter here
                    always the link to Google Translate, like shown in the
                    examples. The link to Google Translate is
                    "http://translate.google.com/?ie=UTF-8&sl=..&tl=..&text=###",
                    where the two-character codes after "sl=" andThe three
                    Uniform Resource IDentifiers "tl=" designate the{' '}
                    <a
                      href="http://www.iana.org/assignments/language-subtag-registry"
                      target='_blank"'
                    >
                      language codes (or "subtags")
                    </a>{' '}
                    for the source and the target language. But a different
                    third web dictionary is of course possible, but sentence
                    translations may not work.
                    <br />
                    <br />
                    If the searchword in the three URIs needs to be converted
                    into a different encoding (standard is UTF-8), you can use
                    ###encoding### as a placeholder. Normally you see this right
                    away if terms show up wrongly in the web dictionary.
                    Example: Linguee expects the searchword in ISO-8859-15, not
                    in UTF-8, so you define it this way:
                    "http://www.linguee.de/search?direction=auto&query=###ISO-8859-15###".
                    A list of encodings can be found{' '}
                    <a
                      href="http://php.net/manual/en/mbstring.supported-encodings"
                      target='_blank"'
                    >
                      here
                    </a>
                    .
                    <br />
                    <br />
                    <b>IMPORTANT:</b> Some dictionaries (including "Google
                    Translate") don't allow to be opened within a frame set. Put
                    an asterisk * in front of the URI (Examples:
                    *http://mywebdict.com?q=### or
                    *http://translate.google.com/?ie=UTF-8&sl=..&tl=..&text=###)
                    to open such a dictionary not within the frame set but in a
                    popup window (please don't forget to deactivate popup window
                    blocking in your browser!).
                    <br /> <br /> <a id="glosbe" />
                    One dictionary (
                    <a
                      href="http://glosbe.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Glosbe
                    </a>{' '}
                    ) has been closely integrated into LWT via the Glosbe API.
                    To use this dictionary, input the "special" dictionary link
                    "<i>glosbe_api?from=...&dest=...&phrase=###</i>" (NO
                    "http://" at the beginning!!) with <i>from</i>: "L2 language
                    code" (the language of your texts) and
                    <i>dest</i>: "L1 language code" (e.g. mother tongue). To
                    find the language codes, open{' '}
                    <a
                      href="http://glosbe.com/all-languages"
                      target="_blank"
                      rel="noreferrer"
                    >
                      this page
                    </a>{' '}
                    to select the "from" (L2) language. On the next page, select
                    the "L2 - L1" language pair. The URL of the next page shows
                    the two language codes, here as an example "French -
                    English": http://glosbe.com/
                    <b>fr</b>/<b>en</b>
                    /. The "from" code is "fr", the "dest" code is "en". Using
                    this dictionary makes the transfer of translation(s) from
                    the Glosbe to LWT very easy: just click on the icon next to
                    the translations to copy them into the LWT edit screen. I
                    recommend to use the LWT-integrated Glosbe dictionary as the
                    "Dictionary 1 URI". Note: I cannot guarantee that the Glosbe
                    API and this special integration will work in the future!
                    glosbe_api is just an example how one can integrate a
                    dictionary into LWT.
                    <br /> <br />
                    You don't know how and where to find a good web dictionary?
                    Try these dictionary directories:
                    <ul>
                      <li>
                        {' '}
                        <a
                          href="http://www.alphadictionary.com/langdir.html"
                          target="_blank"
                          rel="noreferrer"
                        >
                          http://www.alphadictionary.com/langdir.html
                        </a>{' '}
                      </li>
                      <li>
                        {' '}
                        <a
                          href="http://www.lexicool.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          http://www.lexicool.com/
                        </a>{' '}
                      </li>
                    </ul>
                    If you have found a suitable web dictionary, try to
                    translate some words and look whether the word is part of
                    the web address (URI/URL). If yes, replace the word with ###
                    and put this in one of the URI fields within LWT.
                    <br /> <br />
                  </li>

                  <li>
                    The entry "Text Size" defines the relative font size of the
                    text. This is great for Chinese, etc.
                    <br /> <br />
                  </li>

                  <li>
                    "Character Substitutions" is an optional list of "from=to"
                    items with "|" as list separator. The "from" character is
                    replaced by the "to" character ("to" may be also empty). So
                    different kinds of apostrophes can unified or deleted.
                    <br /> <br />
                  </li>

                  <li>
                    "RegExp Split Sentences" is a list of characters that
                    signify a sentence ending (ALWAYS together with a following
                    space or newline!). The space can be omitted (and it is
                    normally), if you set "Make each character a word" to Yes
                    (see below). Whether you include here ":" and ";" - that's
                    your decision. See also <a href="#langsetup">this table</a>.
                    Characters can be also defined in{' '}
                    <a
                      href="http://en.wikipedia.org/wiki/Unicode"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Unicode
                    </a>{' '}
                    form: "\x .... "; the Chinese/Japanese full stop "。" is
                    then "\x
                    {3002}" (always without "). Please inform yourself about
                    Unicode{' '}
                    <a
                      href="http://en.wikipedia.org/wiki/Unicode"
                      target="_blank"
                      rel="noreferrer"
                    >
                      here (general information)
                    </a>{' '}
                    and{' '}
                    <a
                      href="http://unicode.coeurlumiere.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      here (Table of Unicode characters)
                    </a>
                    .
                    <br /> <br />
                  </li>

                  <li>
                    "Exceptions Split Sentences" are a list of exceptions that
                    are NOT to be treated as sentence endings with "|" as list
                    separator. [A-Z] is a character range. If you don't want to
                    split sentences after Mr. / Dr. / A. to Z. / Vd. / Vds. /
                    U.S.A., then you should specify these here:
                    "Mr.|Dr.|[A-Z].|Vd.|Vds.|U.S.A." (without ").
                    <br /> <br />
                  </li>

                  {/* TODO */}
                  <li>
                    "RegExp Word Characters" is a list of characters OR
                    character ranges "x-y" that defines all characters in a
                    word, e.g. English: "a-zA-Z", German: "a-zA-ZaöüÄÖÜß",
                    Chinese: 一-龥. See also <a href="#langsetup">this table</a>
                    . Characters can be also defined in{' '}
                    <a
                      href="http://en.wikipedia.org/wiki/Unicode"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Unicode
                    </a>{' '}
                    form: "\x .... "; the Chinese/Japanese character "one" "一"
                    is then "\x
                    {4}" (always without "). So the above specification for the
                    range of characters in Chinese "一-龥" can also be
                    specified: "{'\\x{4E00}'}-{'\\x{9FA5}'}
                    ".
                    <br /> <br />
                  </li>
                </ul>
                <li>
                  "Make each character a word" is a special option for Chinese,
                  etc. This makes EVERY character a single word (normally words
                  are split by any non-word character or a space). See also{' '}
                  <a href="#langsetup">this table</a> .
                  <br />
                  <br />
                </li>
                <li>
                  "Remove spaces" is another option for Chinese, etc. It removes
                  all spaces from the text (and the example sentences). See also{' '}
                  <a href="#langsetup">this table</a> .
                  <br /> <br />
                </li>
                <li>
                  "Right-To-Left Script" must be set to "Yes" if the
                  language/script is written from right to left, like Arabic,
                  Hebrew, Farsi, Urdu, etc. <br /> <br />
                </li>
                <li>
                  {' '}
                  <a id="extmpl" />
                  "Export Template". The export template controls "Flexible"
                  Term Exports for the terms of that language. It consists of a
                  string of characters. Some parts of this string are
                  placeholders that are replaced by the actual term data,
                  <A target="_blank" href="/info_export_template">
                    see this table
                  </A>
                  . For each term (word or expression), that has been selected
                  for export, the placeholders of the export template will be
                  replaced by the term data and the string will be written to
                  the export file. If the export template is empty, nothing will
                  be exported.
                </li>
              </li>
              <br />
              To understand all these options, please study also{' '}
              <a href="#langsetup">this</a> , look at the examples and play
              around with different settings and different texts.
              <br />
              <br />
              <img className="grayborder" src="img/03.jpg" alt="Image" />
              <br />
              <br />
            </ul>

            <li>
              <b>My Texts</b>
              <br />
              <br />
              The list of texts. You can filter this list according to language,
              title (wildcard = *) or text tag(s) (see also below). The most
              important links for each text are "Read" and "Test" - that's the
              place to read, to listen, to save terms and to review and test
              your terms in sentence context. To see all terms of a text that
              you have saved, click on the numbers in column "Saved Wo+Ex". To
              print, archive, edit (and reparse), or to delete a text, click on
              the icons in column "Actions". There are more actions available,
              see "Multi Actions".
              <br />
              <br />
              <img className="grayborder" src="img/04.jpg" alt="Image" />
              <br />
              <br />
              <b>Multi Actions for marked texts</b>
              <br />
              <br />
              You can test the terms of the marked texts, delete or archive the
              marked texts. "Reparse Texts" rebuilds the sentence and the text
              item cache for all marked texts. "Set Term Sentences" sets a valid
              sentence (with the term in {'{..}'}) for all those saved or
              imported terms that occur in the text and that do not have a
              sentence at all or none with {'{term}'}
              . This makes it easy to "create" sentence examples for imported
              terms.
              <br />
              <br />
              <img className="grayborder" src="img/14.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>My Text Tags</b>
              <br />
              <br />
              The list of your text tags. You can manage your text tags here.
              With text tags, it will be easier to categorize and organize your
              texts. The tags are case sensitive, have 1 to 20 characters, and
              must not contain any spaces or commas.
              <br />
              <br />
              <img className="grayborder" src="img/25.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>
                {' '}
                <a id="howtotext">New/Edit Text (with Check)</a>{' '}
              </b>
              <br />
              <br />
              This is the screen to input, check or edit a single text. Try to
              store not too long texts (the maximum length is 65,000 Bytes). If
              texts are very long (&gt; 1000 words), certain operations (e.g.
              loading a text for reading, calculation of known/unknown words)
              may be quite slow. An audio URI and a link to the text source can
              also be defined. The best place to store your audios is the
              "media" subdirectory below the installation directory "lwt" (you
              have to create it yourself, and you have to copy the audio files
              into this directory; click Refresh if you don't see just copied
              media). But a cloud webspace service like DropBox is also
              possible. In the moment there is no possibility to import/upload
              an audio file within the LWT application. By the way, you can use
              MP3, WAV, or OGG media files, but be aware that not all browsers
              and/or operating systems support all media types! If you click
              "Check", the text will be parsed and split into sentences and
              words according to your language settings. Nothing will be stored
              if you check a text. You can see whether your text needs some
              editing, or whether your language settings (especially the ones
              that influence parsing/splitting) need an adjustment. Words (not
              expressions) that are already in your word list are displayed in
              red, and the translation is displayed. The Non-Word List shows all
              stuff between words. The "Check a Text" function can also be
              started directly from the main menu. If you click on "Change" or
              "Save", the text will be only saved. If you click on "Change and
              Open" or "Save and Open", the text will be saved and opened right
              away.
              <br />
              <br />
              <img className="grayborder" src="img/05.jpg" alt="Image" />
              <br />
              <br />
              You can also import a longer text into LWT with the possibility to
              split it up into several smaller texts. Click on "Long Text
              Import". You must specify the maximum number of sentences per
              text, and the handling of newlines for paragraph detection. It is
              not possible to specify audio files or URIs.
              <br />
              <br />
              <img className="grayborder" src="img/33.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Read a Text</b>
              <br />
              <br />
              This is your "working area": Reading (and listening to) a text,
              saving/editing words and expressions, looking up words,
              expressions, sentences in external dictionaries or Google
              Translate. To create an expression, click on the first word. You
              see "Exp: 2..xx 3..yy 4..zz ...". Just click on the number of
              words (2..9) of the desired expression you want to save. The
              dictionary links for multi word expressions are always in the edit
              frame! You can also use the Keyboard in the text frame, see{' '}
              <a href="#keybind">Key Bindings</a> . Double clicking on a word
              sets the audio position approximately to the text position, if an
              audio was defined. The other audio controls are self-explanatory:
              automatic repeat, rewind and move forward n seconds, etc.).
              <br />
              <br />
              <img className="grayborder" src="img/06.jpg" alt="Image" />
              <br />
              <br />
              Reading a Right-To-Left Script (Hebrew):
              <br />
              <br />
              <img className="grayborder" src="img/26.jpg" alt="Image" />
              <br />
              <br />
              With the checkbox [Show All] you can switch the display of text:
              <br />
              <br />
              [Show All] = ON (see below): All terms are shown, and all
              multi-word terms are shown as superscripts before the first word.
              The superscript indicates the number of words in the multi-word
              term.
              <br />
              <br />
              <img className="grayborder" src="img/22.jpg" alt="Image" />
              <br />
              <br />
              [Show All] = OFF (see below): Multi-word terms now hide single
              words and shorter or overlapping multi-word terms. This makes it
              easier to concentrate on multi-word terms while displaying them
              without superscripts, but creation and deletion of multi-word
              terms can be a bit slow in long texts.
              <br />
              <br />
              <img className="grayborder" src="img/30.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Test terms</b>
              <br />
              <br />
              Tests are only possible if a term has a translation. Terms with
              status "Ignored" and "Well Known" are never tested, and terms with
              a positive or zero score are not tested today. In summary, the
              term score must fall below zero to trigger the test. See also{' '}
              <a href="#termscores">Term scores</a> . Terms that are due today
              are marked with a red bullet in the term table. Terms that are due
              tomorrow are marked with a yellow bullet in the term table.
              <br />
              <br />
              During a test, a status display (at the bottom of the test frame)
              shows you the elapsed time "mm:ss", a small bar graph, and the
              total, not yet tested, wrong and correct terms in this test.
              <br />
              <br />
              In the following, L1 denotes you mother tongue (= translations),
              and L2 the language you want to learn (= the terms (words and
              expressions).
              <br />
              <br />
            </li>

            <li>
              <b>Test terms in a text (L2 -&gt; L1)</b>
              <br />
              <br />
              This is Test #1 or #4: L2 -&gt; L1 (recognition) - to train your
              ability to recognize a L2 term. You may test within sentence
              context (Button "..[L2].."), or just the term (Button "[L2]"). You
              can also use the Keyboard in the test frame, see{' '}
              <a href="#keybind">Key Bindings</a> .
              <br />
              <br />
              <img className="grayborder" src="img/07.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Test terms in a text (L1 -&gt; L2)</b>
              <br />
              <br />
              This is Test #2 or #5: L1 -&gt; L2 (recall) - to train your
              ability to produce a term from L1. You may test within sentence
              context (Button "..[L1].."), or just the term (Button "[L1]"). You
              can also use the Keyboard in the test frame, see{' '}
              <a href="#keybind">Key Bindings</a> .
              <br />
              <br />
              <img className="grayborder" src="img/11.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Test terms in a text (••• -&gt; L2)</b>
              <br />
              <br />
              This is test #3: ••• -&gt; L2 (recall) - to train your ability to
              produce a term only from the sentence context (Button "..[••]..").
              If you hover over "[•••]", a tooltip displays the translation of
              the term. You can also use the Keyboard in the test frame, see{' '}
              <a href="#keybind">Key Bindings</a> .
              <br />
              <br />
              <img className="grayborder" src="img/12.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>
                Test yourself in a table / word list format (Button "Table")
              </b>
              <br />
              <br />
              This is test #6: The selected terms and expressions are presented
              as a table. You can make invisible either the columns "Term" or
              "Translation", and you can hide or show the columns "Sentence",
              "Romanization", "Status" and "Ed" (Edit). To reveal the invisible
              solution ("Term" or "Translation"), you just click into the empty
              table cell. You can review or test yourself with or without
              changing the status by clicking "+" or "-" in the "Status" column.
              A status in red signifies that the term is due for testing. You
              can also edit the term by clicking the yellow "Edit" icon. Columns
              2 to 6 may also my sorted by clicking on the header row. The
              initial sort order is according to term score.
              <br />
              <br />
              <img className="grayborder" src="img/32.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Print a text</b>
              <br />
              <br />
              Here you print a text. Optional: an inline annotation (translation
              and/or romanization) of terms that are of specified status(es).
              This screen is also great to just read or study a text.
              <br />
              <br />
              Chinese Text with annotation (Romanization/Pinyin and
              translation):
              <br />
              <br />
              <img className="grayborder" src="img/20.jpg" alt="Image" />
              <br />
              <br />
              Chinese Text with annotation (only Romanization/Pinyin):
              <br />
              <br />
              <img className="grayborder" src="img/21.jpg" alt="Image" />
              <br />
              <br /> <a id="il" />
              <b>
                How to create, edit, and use an <i>Improved Annotated Text</i>:
              </b>
              <br />
              <br />
              <b>Motivation:</b> Annotated texts (as{' '}
              <a
                target="_blank"
                href="http://en.wikipedia.org/wiki/Interlinear_gloss"
                rel="noreferrer"
              >
                interlinear text
              </a>{' '}
              ) have been used for language learning for a long time. One
              example are the word-by-word translations in{' '}
              <a target="_blank" href="http://en.assimil.com/" rel="noreferrer">
                Assimil
              </a>{' '}
              courses. The German{' '}
              <a
                target="_blank"
                href="http://web.archive.org/web/20070223080453/http://195.149.74.241/BIRKENBIHL/PDF/MethodEnglish.pdf"
                rel="noreferrer"
              >
                V. F. Birkenbihl
              </a>{' '}
              proposes the creation of interlinear word-by-word or{' '}
              <a
                target="_blank"
                href="http://learnanylanguage.wikia.com/wiki/Hyperliteral_translations"
                rel="noreferrer"
              >
                hyperliteral
              </a>{' '}
              translations (calling this creation "decoding") in foreign
              language learning. Learning Latin or Ancient Greek via interlinear
              texts is quite old as you can see in{' '}
              <a
                target="_blank"
                href="http://www.youtube.com/watch?v=XnEKnezLXJg"
                rel="noreferrer"
              >
                this YouTube video
              </a>
              .
              <br />
              <br />
              LWT's old "Print Screen" offers annotations, but it displays ALL
              translations of a term. The <i>Improved Annotated Text</i>
              feature enables you to select the best translation for every word
              in the text. As a result, you create an L1 word-by-word
              translation that is displayed above the L2 text. This interlinear
              text is better suited for language study, especially for
              beginners.
              <br />
              <br />
              <b>Method:</b> While listening to the audio, first follow the blue
              annotations in your native language while listening and
              understanding. Later, after understanding the text fully, you read
              the foreign language text alone. Repeat this often. After these
              steps, you listen to the text passively or do shadowing.
              <br />
              <br />
              On the Print Screen, click on "Create" an Improved Annotated Text.
              The system creates a default annotated text.
              <br />
              <br />
              <b>Edit Mode:</b>
              <br />
              <br />
              <img className="grayborder" src="img/28.jpg" alt="Image" />
              <br />
              <br />
              Within the "Improved Annotated Text - Edit Mode", you can select
              the best term translation by clicking on one of the radio buttons.
              To be able to do this, multiple translations must be delimited by
              one of the delimiters specified in the LWT Settings (currently:
              /;|). You can also type in a new translation into the text box at
              the end (this does not change your saved term translation), or you
              may change your term by clicking on the yellow icon or add a
              translation by clicking on the green "+" icon (this does change
              your saved term translation), and select it afterwards. The "Star"
              icon indicated that you want the term itself as annotation.{' '}
              <b>Important:</b> It's not possible to create new terms here -
              please do this in the "Read text" screen. Changing the language
              settings (e.g. the word characters) may have the effect that you
              have to start from scratch. The best time for the creation of an
              improved annotated text is after you have read the text completely
              and created all terms and expressions in the "Read text" screen.
              <br />
              <br />
              <b>Warning:</b> If you change the text, you will lose the saved
              improved annotated text!
              <br />
              All changes in the Edit screen are saved automatically in the
              background!
              <br />
              <br />
              To leave the Edit mode, click on "Display/Print Mode". You may
              then print or display (with audio) the text, and work with the
              text online or offline.
              <br />
              <br />
              <b>Print Mode:</b>
              <br />
              <br />
              <img className="grayborder" src="img/27.jpg" alt="Image" />
              <br />
              <br />
              <b>Display Mode</b> (with audio player) in a separate window.
              Clicking the "T" or "A" lightbulb icons hides/shows the text or
              the blue annotations. You may also click on a single term or a
              single annotation to show or to hide it. This enables you to test
              yourself or to concentrate on one text only. Romanizations, if
              available, appear while hovering over a term.
              <br />
              <br />
              <img className="grayborder" src="img/29.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>My Terms</b>
              <br />
              <br />
              The list of your saved words or expressions (= terms). You may
              filter the list of terms by language, text, status,
              term/romanization/translation (wildcard * possible) or term
              tag(s). Different sort orders are possible. You can do "multi
              actions" only on the marked or on all terms (on all pages!). "Se?"
              displays a green dot if a valid sentences with {'{term}'}
              exists. "Stat/Days" displays the status and the number of days
              since the last status change. The score of a term is a rough
              measure (in percent) how well you know a term. Read more about
              term scores <a href="#termscores">here</a> . Terms with zero score
              are displayed red and should be tested today.
              <br />
              <br />
              <img className="grayborder" src="img/08.jpg" alt="Image" />
              <br />
              <br />
              <b>Multi Actions for marked terms</b>
              <br />
              <br />
              Most actions are self-explanatory. "Test Marked Terms" starts a
              test with all marked terms. You may delete marked terms and change
              the status of marked terms. "Set Status Date to Today" is some
              kind of "trick" for vacations, illnesses, etc.
              <br />
              <br />
              "Export Marked Texts (Anki)" exports all terms that have been
              marked AND have a valid sentence with {'{term}'} for Anki. Terms
              that do not have a sentence with {'{term}'} will NOT be exported.
              Cloze testing of terms within sentence context can so be easily
              done in Anki. The export is tab-delimited: (1) term, (2)
              translation, (3) romanization, (4) Sentence without term (question
              of cloze test), (5) Sentence with term (answer of cloze test), (6)
              Language, (7) ID Number, (8) Tag list. Anki template decks (for
              Anki Version 1 and 2) are provided: "LWT.anki" and "LWT.apkg" in
              directory "anki".
              <br />
              <br />
              "Export Marked Texts (TSV)" exports all terms that have been
              marked. The export is tab-delimited: (1) term, (2) translation,
              (3) sentence, (4) romanization, (5) status, (6) language, (7) ID
              Number, (8) tag list.
              <br />
              <br />
              <img className="grayborder" src="img/16.jpg" alt="Image" />
              <br />
              <br />
              <b>
                Multi Actions for all terms on all pages of the current query
              </b>
              <br />
              <br />
              Explanations see above.
              <br />
              <br />
              <img className="grayborder" src="img/17.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>My Term Tags</b>
              <br />
              <br />
              The list of your term tags. You can manage your term tags here.
              With term tags, it will be easier to categorize and organize your
              terms. The tags are case sensitive, have 1 to 20 characters, and
              must not contain any spaces or commas.
              <br />
              <br />
              <img className="grayborder" src="img/24.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>My Text Archive</b>
              <br />
              <br />
              The list of archived texts. To unarchive, to edit or to delete a
              text, click on the icon under "Actions". There are also "Multi
              Actions" available.
              <br />
              <br />
              What is the difference between (active) texts and archived texts?
              <br />
              <br />
              <ul>
                <li>
                  <b>(Active) texts</b>
                  <ul>
                    <li>
                      They have been parsed and tokenized according to the rules
                      defined for the language.
                    </li>
                    <li>
                      The result is stored in a cache of sentences and text
                      items.
                    </li>
                    <li>They use a lot of space in the database.</li>
                    <li>
                      Reading with term creation/editing and dictionary lookup
                      is possible.
                    </li>
                    <li>
                      Testing of a stored term that occurs in the text, is
                      possible. A terms will be tested within the context of any
                      sentence(s) in all active texts (the number of sentences
                      may be set (1, 2, or 3) as a preference).
                    </li>
                  </ul>
                  <br />
                </li>
                <li>
                  <b>Archived texts</b>
                  <ul>
                    <li>
                      They are not parsed and tokenized, only the text is
                      stored.
                    </li>
                    <li>
                      Compared with active texts, they don't use much space in
                      the database, because no sentences and no text items are
                      stored.
                    </li>
                    <li>
                      Reading with term creation/editing and dictionary lookup
                      is not possible.
                    </li>
                    <li>
                      Testing of a stored term, that occurs in the text, is
                      possible, but a term will be tested ONLY within the
                      context of the sentence(s) that has/have been stored with
                      the term in the sentence field, if the term does not occur
                      in any active text.
                    </li>
                  </ul>
                </li>
              </ul>
              <br />
              <br />
              <img className="grayborder" src="img/13.jpg" alt="Image" />
              <br />
              <br />
              <b>Multi Actions for marked archived texts</b>
              <br />
              <br />
              <img className="grayborder" src="img/15.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>My Statistics</b>
              <br />
              <br />
              It's self-explanatory and shows your performance. The numbers in
              the first table are links, by clicking on them you jump to the
              table of all terms in that status and language.
              <br />
              <br />
              <img className="grayborder" src="img/09.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Import Terms</b>
              <br />
              <br />
              Import a list of terms for a language, and set the status for all
              to a specified value. You can specify a file to upload or
              type/paste the data directly into the textbox. Format: one term
              per line, fields (columns) are separated either by comma ("CSV"
              file, e.g. used in LingQ as export format), TAB ("TSV" file, e.g.
              copy and paste from a spreadsheet program, not possible if you
              type in data manually) or # (if you type in data manually). The
              field/column assignment must be specified on the left. Important:
              You must import a term. The translation can be omitted if the
              status should be set to 98 or 99 (ignore/well known). Translation,
              romanization and sentence are all optional, but please understand
              that tests are only possible if terms have a translation. If a
              term already exists in the database (comparison is NOT case
              sensitive), it will not be overwritten; the line will be ignored.
              You can change this by setting "Overwrite existent terms" to
              "Yes". Be careful using this screen, a database backup before the
              import and double-checking everything is always advisable!
              <br />
              <br />
              <img className="grayborder" src="img/10.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Backup/Restore/Empty Database</b>
              <br />
              <br />
              This screen offers a possibility to save, restore or empty the LWT
              database (ONLY the current table set!). This makes it easy to try
              out new things or just to make regular backups. "Restore" only
              accepts files that have been created with the "Backup" function
              above. "Empty Database" deletes the data of all tables (except the
              settings) of the current table set, and you can start from scratch
              afterwards. Be careful: you may lose valuable data!
              <br />
              <br />
              <img className="grayborder" src="img/18.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>Settings/Preferences</b>
              <br />
              <br />
              In this screen you can adjust the program according to your needs.
              The geometric properties of the <i>Read Text</i> and
              <i>Test</i> screens can be changed. This is important because
              different browsers and font sizes may result in an unpleasant
              viewing experience. The waiting time to display the next test and
              to hide the old message after a test assessment can also be
              changed. The number of sentences displayed during testing and
              generated during term creation can be set to 1 (default), 2 or 3;
              if set to 2 or 3 you are able to do "MCD" (Massive-Context Cloze
              Deletion) testing, proposed by Khatzumoto @ AJATT. The number of
              items per page on different screens can be set, and you can decide
              whether you want to see the word counts on the textpage
              immediately (page may load slow) or later (faster initial
              loading).
              <br />
              <br />
              <img className="grayborder" src="img/19.jpg" alt="Image" />
              <br />
              <br />
            </li>

            <li>
              <b>
                {' '}
                <a id="mue" />
                Multiple LWT table sets
              </b>
              <br />
              <br />
              <b>WARNING:</b> The use of the "Multiple LWT table sets" feature
              on an external web server may cause a
              <b>monstrous database size</b> if some users import many or large
              texts. Without further improvements (e. g. user quotas, etc.), LWT
              with activated "Multiple LWT table sets" is in its current version
              <b>not suitable</b> to be run in a public environment on an
              external web server!
              <br />
              <br />
              When you start using LWT, you store all your data in the "Default
              Table Set" within the database you have defined in the file
              "connect.inc" during the LWT installation.
              <br />
              <br />
              Beginning with LWT Version 1.5.3, you are able to create and to
              use unlimited LWT table sets within one database (as space and
              MySQL limitations permit). This feature is especially useful for
              users who want to set up a multi user environment with a set of
              tables for each user. You can also create one table set for every
              language you study - this allows you to create different term/text
              tags for each language. If you don't need this feature, you just
              use LWT like in earlier versions with the "default table set".
              Please observe that the "Backup/Restore/Empty Database" function
              only works for the CURRENT table set, NOT for ALL table sets you
              have created!
              <br />
              <br />
              Just click on the link at the bottom of the LWT home screen where
              the current table set name (or "Default") is displayed. In a new
              screen "Select, Create or Delete a Table Set" you may switch and
              manage table sets. A table set name is max. 20 characters long.
              Allowed characters are only: a-z, A-Z, 0-9, and the underscore
              "_".
              <br />
              <br />
              <img className="grayborder" src="img/31.jpg" alt="Image" />
              <br />
              <br />
              If you want "switch off" this feature, and use just one table set,
              you may define the name in the file "connect.inc":
              <br />
              <br />
              <b>tbpref = "";</b> &nbsp; &nbsp; &nbsp; // only the default table
              set
              <br />
              <br />
              <b>tbpref = "setname";</b> &nbsp; &nbsp; &nbsp; // only the table
              set "setname"
              <br />
              <br />
              After adding such a line in the file "connect.inc", you are not
              able to select, create or delete table sets anymore. Only the one
              you have defined in "connect.inc" will be used. Please observe the
              rules for table set names (see above)!!
              <br />
              <br />
              If more than one table set exists, and tbpref was NOT set to a
              fixed value in "connect.inc", you can select the desired table set
              via "start" (use this as start page if several people use their
              own table set), or by clicking on the LWT icon or title in the LWT
              menu screen "index".
              <br />
              <br />
              By hovering over the LWT icon in the top left corner of every
              screen, you can display the current table set in a yellow tooltip.
              <br />
              <br />
            </li>

            {/* </ul> */}
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="faq">Questions and Answers</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                I want to use LWT, and I see something like this:
                <br />
                <br />
                <img className="grayborder" src="img/prob1.png" alt="Image" />
                <br />
                <br />
                Answer: Your local webserver (Apache) is not running. Please
                start it via EasyPHP or MAMP control program/panel.
                <br />
                <br />
              </li>

              <li>
                I want to use LWT, and I see something like this:
                <br />
                <br />
                <img className="grayborder" src="img/prob2.png" alt="Image" />
                <br />
                <br />
                Answer: The server is running, but the application is not found.
                Maybe the Uniform Resource IDentifier (URI) is wrong or
                misspelled. Please check/correct it. Or the URI is correct, and
                the application is installed, but not in the correct directory{' '}
                <i>lwt</i> below <i>htdocs</i>
                . Please install/copy/move it into the correct directory.
                <br />
                <br />
              </li>

              <li>
                I want to use LWT, and I see this:
                <br />
                <br />
                <img className="grayborder" src="img/prob3.png" alt="Image" />
                <br />
                <br />
                Answer: Either the database (MySQL) is not running, or the
                database connection parameters in
                <i>../htdocs/lwt/connect.inc</i> are wrong. Please check/correct
                the database connection parameters and/or start MySQL via the
                MAMP or EasyPHP control program/panel.
                <br />
                <br />
              </li>

              <li>
                I want to use LWT, and I see this:
                <br />
                <br />
                <img className="grayborder" src="img/prob4.png" alt="Image" />
                <br />
                <br />
                Answer: The Webserver and the database is running, but the
                database connection parameter file
                <i>../htdocs/lwt/connect.inc</i> is not found. Please rename one
                of the connection files (according to your server) to
                <i>../htdocs/lwt/connect.inc</i>
                .
                <br />
                <br />
              </li>

              <li>
                I have installed or updated LWT on Linux, but the application
                does not run as expected:
                <br />
                <br />
                Answer 1: The Webserver does not have full access to all LWT
                files (insufficient rights). Open a terminal window, go to the
                directory where the directory "lwt" has been created with all
                LWT files, e. g. <br />
                <b>cd /var/www/html</b>
                <br />
                Now execute:
                <br />
                <b>sudo chmod -R 755 lwt</b>
                .
                <br />
                <br />
                Answer 2: The PHP "mbstring" extension is not installed. Please
                install it;{' '}
                <a
                  href="https://askubuntu.com/questions/491629/how-to-install-php-mbstring-extension-in-ubuntu"
                  target="_blank"
                  rel="noreferrer"
                >
                  see this article
                </a>
                .
                <br />
                <br />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="ipad">Setup for Tablets</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                If you want to use LWT on a tablet: that's possible (even the
                audio player works!).
              </li>
              <li>
                In "Settings/Preferences", set the "Frame Set Display Mode" to
                "Auto" or "Force Mobile". On other mobile devices, you may also
                try "Force Non-Mobile" if you are unhappy with the results.
              </li>
              <li>
                Try to reduce the length of your texts to reduce scrolling.
              </li>
              <li>
                It's also a good idea to install and run LWT at a web hoster. So
                you can access LWT easily if you are often on the go.
              </li>
              <li>
                I hope you will enjoy using LWT on a tablet although creating
                new terms and copy & paste can be a bit tedious.
                <br />
                <br />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="langsetup">Language Setup</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                This section shows some language setups ("RegExp Split
                Sentences", "RegExp Word Characters", "Make each character a
                word", "Remove spaces") for different languages. They are only
                recommendations, and you may change them according to your needs
                (and texts). See also <a href="#go1">here</a> .
                <br />
                <br />
              </li>

              <li>
                If you are unsure, try the "Language Settings Wizard" first.
                Later you can adjust the settings.
                <br />
                <br />
              </li>

              <li>
                Please inform yourself about Unicode{' '}
                <a
                  href="http://en.wikipedia.org/wiki/Unicode"
                  target="_blank"
                  rel="noreferrer"
                >
                  here (general information)
                </a>{' '}
                and{' '}
                <a
                  href="http://unicode.coeurlumiere.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  here (Table of Unicode characters)
                </a>{' '}
                and about the characters that occur in the language you learn!
                <br />
                <br />
                <table className="tab3" cellSpacing={0} cellPadding={5}>
                  <tbody>
                    <tr className="tr1">
                      <th className="th1">Language</th>
                      <th className="th1">
                        RegExp
                        <br />
                        Split
                        <br />
                        Sentences
                      </th>
                      <th className="th1">
                        RegExp
                        <br />
                        Word
                        <br />
                        Characters
                      </th>
                      <th className="th1">
                        Make each
                        <br />
                        character
                        <br />a word
                      </th>
                      <th className="th1">
                        Remove
                        <br />
                        spaces
                      </th>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">
                        Latin and all languages
                        <br />
                        with a Latin derived alphabet
                        <br />
                        (English, French, German, etc.)
                      </td>
                      <td className="td1">.!?:;</td>
                      <td className="td1">a-zA-ZÀ-ÖØ-öø-ȳ</td>
                      <td className="td1">No</td>
                      <td className="td1">No</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">
                        Languages with a
                        <br />
                        Cyrillic-derived alphabet
                        <br />
                        (Russian, Bulgarian, Ukrainian, etc.)
                      </td>
                      <td className="td1">.!?:;</td>
                      <td className="td1">a-zA-ZÀ-ÖØ-öø-ȳЀ-ӹ</td>
                      <td className="td1">No</td>
                      <td className="td1">No</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Greek</td>
                      <td className="td1">.!?:;</td>
                      <td className="td1">
                        {'\\x{0370}-\\x{03FF}\\x{1F00}-\\x{1FFF}'}
                      </td>
                      <td className="td1">No</td>
                      <td className="td1">No</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Hebrew (Right-To-Left = Yes)</td>
                      <td className="td1">.!?:;</td>
                      <td className="td1">{'\\x{0590}-\\x{05FF}'}</td>
                      <td className="td1">No</td>
                      <td className="td1">No</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Thai</td>
                      <td className="td1">.!?:;</td>
                      <td className="td1">ก-๛</td>
                      <td className="td1">No</td>
                      <td className="td1">Yes</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Chinese</td>
                      <td className="td1">.!?:;。！？：；</td>
                      <td className="td1">一-龥</td>
                      <td className="td1">Yes or No</td>
                      <td className="td1">Yes</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Japanese</td>
                      <td className="td1">.!?:;。！？：；</td>
                      <td className="td1">一-龥ぁ-ヾ</td>
                      <td className="td1">Yes or No</td>
                      <td className="td1">Yes</td>
                    </tr>

                    <tr className="tr1">
                      <td className="td1">Korean</td>
                      <td className="td1">.!?:;。！？：；</td>
                      <td className="td1">가-힣ᄀ-ᇂ</td>
                      <td className="td1">No</td>
                      <td className="td1">No or Yes</td>
                    </tr>
                  </tbody>
                </table>
                <br />
              </li>

              <li>
                "\'" = Apostrophe, and/or "\-" = Dash, may be added to "RegExp
                Word Characters", then words like "aujourd'hui" or
                "non-government-owned" are one word, instead of two or more
                single words. If you omit "\'" and/or "\-" here, you can still
                create a multi-word expression "aujourd'hui", etc., later.
                <br />
                <br />
              </li>

              <li>
                ":" and ";" may be omitted in "RegExp Split Sentences", but
                longer example sentences may result from this.
                <br />
                <br />
              </li>

              <li>
                "Make each character a word" = "Yes" should only be set in
                Chinese, Japanese, and similar languages. Normally words are
                split by any non-word character or whitespace. If you choose
                "Yes", then you do not need to insert spaces to specify word
                endings. If you choose "No", then you must prepare texts without
                whitespace by inserting whitespace to specify words. If you are
                a beginner, "Yes" may be better for you. If you are an advanced
                learner, and you have a possibility to prepare a text in the
                above described way, then "No" may be better for you.
                <br />
                <br />
              </li>

              <li>
                "Remove spaces" = "Yes" should only be set in Chinese, Japanese,
                and similar languages to remove whitespace that has been
                automatically or manually inserted to specify words.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="termscores">Term Scores</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                The score of a term is a rough measure (in percent) how well you
                know a term. It is displayed in "My Terms", and it is used in
                tests to decide which terms are tested next.
                <br />
                <br />
              </li>

              <li>
                The score is calculated as follows:
                <br />
                <br />
                <img
                  className="grayborder"
                  src="img/score1full.png"
                  alt="Image"
                />
                <br />
                <br />
                Terms with status 1 are tested either today (if not created
                today) or tomorrow (if created today, or a test failed today).
                Terms set to status 2 should be retested after 2 days. Terms set
                to status 3 should be retested after 9 days. Terms set to status
                4 should be retested after 27 days. Terms set to status 5 should
                be retested after 72 days.
                <br />
                <br />
              </li>

              <li>
                Example 1: Five terms were tested today; they are now in status
                1, 2, 3, 4, and 5. The term with status 1 is still unknown
                (failed the test, so the score is still 0 %). The term with
                status 5 is well known (score: 100 %).
                <br />
                <br />
                <img className="grayborder" src="img/score2.png" alt="Image" />
                <br />
                <br />
              </li>

              <li>
                Example 2: Five terms were not tested for some time; they are in
                status 1, 2, 3, 4, and 5. All of them have a score of 0, because
                the number of days indicate that you may have forgotten them.
                Therefore all should be retested today.
                <br />
                <br />
                <img className="grayborder" src="img/score3.png" alt="Image" />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="keybind">Key Bindings</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                Important: Before using the keyboard you must set the focus
                within the frame by clicking once on the frame!
                <br />
                <br />
              </li>
              <li>
                Key Bindings in the TEXT Frame
                <br />
                <table className="tab3" cellSpacing={0} cellPadding={5}>
                  <tbody>
                    <tr className="tr1">
                      <th className="th1">Key(s)</th>
                      <th className="th1">Action(s)</th>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">RETURN</td>
                      <td className="td1">
                        The next UNKNOWN (blue) word in the text will be shown
                        for creation
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">RIGHT or SPACE</td>
                      <td className="td1">
                        Mark next SAVED (non-blue) term (*)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">LEFT</td>
                      <td className="td1">
                        Mark previous SAVED (non-blue) term (*)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">HOME</td>
                      <td className="td1">
                        Mark first SAVED (non-blue) term (*)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">END</td>
                      <td className="td1">
                        Mark last SAVED (non-blue) term (*)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">1, 2, 3, 4, 5</td>
                      <td className="td1">
                        Set status of marked term to 1, 2, 3, 4, or 5
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">I</td>
                      <td className="td1">
                        Set status of marked term to "Ignored"
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">W</td>
                      <td className="td1">
                        Set status of marked term to "Well Known"
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">E</td>
                      <td className="td1">Edit marked term</td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">A</td>
                      <td className="td1">
                        Set audio position according to position of marked term.
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">ESC</td>
                      <td className="td1">Reset marked term(s)</td>
                    </tr>
                  </tbody>
                </table>
                (*) Only saved terms with the status(es) defined/filtered in the
                settings are visited and marked!
                <br />
                <br />
              </li>
              <li>
                Key Bindings in the TEST Frame
                <br />
                <table className="tab3" cellSpacing={0} cellPadding={5}>
                  <tbody>
                    <tr className="tr1">
                      <th className="th1">Key(s)</th>
                      <th className="th1">Action(s)</th>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">SPACE</td>
                      <td className="td1">Show solution</td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">UP</td>
                      <td className="td1">
                        Set status of tested term to (old status plus 1)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">DOWN</td>
                      <td className="td1">
                        Set status of tested term to (old status minus 1)
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">ESC</td>
                      <td className="td1">
                        Do not change status of tested term
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">1, 2, 3, 4, 5</td>
                      <td className="td1">
                        Set status of tested term to 1, 2, 3, 4, or 5
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">I</td>
                      <td className="td1">
                        Set status of tested term to "Ignored"
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">W</td>
                      <td className="td1">
                        Set status of tested term to "Well Known"
                      </td>
                    </tr>
                    <tr className="tr1">
                      <td className="td1">E</td>
                      <td className="td1">Edit tested term</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          <dt>
            ▶
            <b>
              {' '}
              <a id="history">Changelog</a>{' '}
            </b>
            - <a href="#">[↑]</a>{' '}
          </dt>

          <dd>
            <ul>
              <li>
                2.0.3 (February 15 2022):
                <br />
                An incompatibility with PHP 8.1+ (changed mysqli_report default
                setting in PHP 8.1+) has been fixed.
                <br />
                <br />
              </li>

              <li>
                2.0.2 (September 07 2021):
                <br />
                An incompatibility with PHP 8+ (removed function
                "get_magic_quotes_gpc()" in PHP 8+) has been fixed. Thanks to
                Lucas L. for the hint.
                <br />
                <br />
              </li>

              <li>
                2.0.1 (October 07 2020):
                <br />
                A bug when visiting terms/expressions with key strokes LEFT or
                RIGHT after a previous status change and with a set status
                filtering has been fixed.
                <br />
                <br />
              </li>

              <li>
                2.0.0 (October 04 2020):
                <br />
                No code changes. Sourceforge links corrected.
                <br />
                The old links [lwt.sf.net], [lwt.sourceforge.net] or
                [sourceforge.net/projects/lwt] are no longer valid!
                <br />
                The new links are now{' '}
                <a
                  href="https://learning-with-texts.sourceforge.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  learning-with-texts.sourceforge.io
                </a>{' '}
                (documentation and demo database) and{' '}
                <a
                  href="https://sourceforge.net/projects/learning-with-texts"
                  target="_blank"
                  rel="noreferrer"
                >
                  sourceforge.net/projects/learning-with-texts
                </a>{' '}
                (project home and downloads).
                <br />
                <br />
              </li>

              <li>
                1.6.3 (April 06 2020):
                <br />
                Some missing confirmation dialogues (when deleting a single
                text, text tag, term, term tag, or language) added.
                <br />
                <br />
              </li>

              <li>
                1.6.2 (March 10 2018, this page "info.htm" last updated August
                12 2019):
                <br />
                New features:
                <br />
                Audio playback speed can now be set between 0.5x and 1.5x.
                <br />
                Waiting wheel (to indicate saving data to database in the
                background) added in "Edit Improved Annotated Text".
                <br />
                Checking for characters in the Unicode Supplementary
                Multilingual Planes (&gt; U+FFFF) like emojis or very rare
                characters improved/added. Such characters are currently not
                supported.
                <br />
                Updates/bug fixes:
                <br />
                jQuery library updated to v1.12.4.
                <br />
                "Mobile_Detect" updated to v2.8.30.
                <br />
                LWT demo database updated.
                <br />
                Documentation updated.
                <br />
                Some minor glitches fixed.
                <br />
                Glosbe API calls via "glosbe_api" in demo database and language
                settings wizard removed - they often did not work due to API
                restrictions. The file "glosbe_api" is still supplied as an
                example of a close integration of a dictionary API into LWT.
                <br />
                <br />
              </li>

              <li>
                1.6.1 (February 01 2016, this page "info.htm" last updated
                January 13 2018):
                <br />
                The jQuery and jPlayer libraries have been updated to v1.12.0
                and v2.9.2, respectively. The jQuery.ScrollTo package has been
                updated to v2.1.2.
                <br /> <a href="#links">Link</a> to Chinese text segmentation
                "Jieba" added in documentation (Important Links - Additional
                Resources - For learners of Chinese).
                <br />
                <br />
              </li>

              <li>
                1.6.0 (January 28 2016):
                <br />
                As mysql_* database calls are deprecated and are no longer
                supported by PHP, they have been changed to the corresponding
                mysqli_* calls. If you run a server with PHP version 7.0.0 or
                higher, you MUST use LWT 1.6.0 or higher. Thanks to Laurens
                Vercaigne for his work!
                <br />
                Debugging updated. Status information on start page improved.
                Documentation updated.
                <br />
                <br />
              </li>
            </ul>
          </dd>
        </dl>
        <FooterInfo />
      </div>
    </body>
  );
}
