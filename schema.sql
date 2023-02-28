CREATE TABLE `archivedtexts` (
   `AtID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `AtLgID` int(11) unsigned NOT NULL,
   `AtTitle` varchar(200) NOT NULL,
   `AtText` text NOT NULL,
   `AtAnnotatedText` longtext NOT NULL,
   `AtAudioURI` varchar(200) DEFAULT NULL,
   `AtSourceURI` varchar(1000) DEFAULT NULL,
   PRIMARY KEY (`AtID`),
   KEY `AtLgID` (`AtLgID`) ) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
CREATE TABLE `archtexttags` (
   `AgAtID` int(11) unsigned NOT NULL,
   `AgT2ID` int(11) unsigned NOT NULL,
   PRIMARY KEY (`AgAtID`,`AgT2ID`),
   KEY `AgAtID` (`AgAtID`),
   KEY `AgT2ID` (`AgT2ID`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `languages` (
   `LgID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `LgName` varchar(40) NOT NULL,
   `LgDict1URI` varchar(200) NOT NULL,
   `LgDict2URI` varchar(200) DEFAULT NULL,
   `LgGoogleTranslateURI` varchar(200) DEFAULT NULL,
   `LgExportTemplate` varchar(1000) DEFAULT NULL,
   `LgTextSize` int(5) unsigned NOT NULL DEFAULT '100',
   `LgCharacterSubstitutions` varchar(500) NOT NULL,
   `LgRegexpSplitSentences` varchar(500) NOT NULL,
   `LgExceptionsSplitSentences` varchar(500) NOT NULL,
   `LgRegexpWordCharacters` varchar(500) NOT NULL,
   `LgRemoveSpaces` int(1) unsigned NOT NULL DEFAULT '0',
   `LgSplitEachChar` int(1) unsigned NOT NULL DEFAULT '0',
   `LgRightToLeft` int(1) unsigned NOT NULL DEFAULT '0',
   PRIMARY KEY (`LgID`),
   UNIQUE KEY `LgName` (`LgName`) ) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
CREATE TABLE `sentences` (
   `SeID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `SeLgID` int(11) unsigned NOT NULL,
   `SeTxID` int(11) unsigned NOT NULL,
   `SeOrder` int(11) unsigned NOT NULL,
   `SeText` text,
   PRIMARY KEY (`SeID`),
   KEY `SeLgID` (`SeLgID`),
   KEY `SeTxID` (`SeTxID`),
   KEY `SeOrder` (`SeOrder`) ) ENGINE=MyISAM AUTO_INCREMENT=4763 DEFAULT CHARSET=utf8;
CREATE TABLE `settings` (
   `StKey` varchar(40) NOT NULL,
   `StValue` varchar(40) DEFAULT NULL,
   PRIMARY KEY (`StKey`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `tags` (
   `TgID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `TgText` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
   `TgComment` varchar(200) NOT NULL DEFAULT '',
   PRIMARY KEY (`TgID`),
   UNIQUE KEY `TgText` (`TgText`) ) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
CREATE TABLE `tags2` (
   `T2ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `T2Text` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
   `T2Comment` varchar(200) NOT NULL DEFAULT '',
   PRIMARY KEY (`T2ID`),
   UNIQUE KEY `T2Text` (`T2Text`) ) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
CREATE TABLE `textitems` (
   `TiID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `TiLgID` int(11) unsigned NOT NULL,
   `TiTxID` int(11) unsigned NOT NULL,
   `TiSeID` int(11) unsigned NOT NULL,
   `TiOrder` int(11) unsigned NOT NULL,
   `TiWordCount` int(1) unsigned NOT NULL,
   `TiText` varchar(250) NOT NULL,
   `TiTextLC` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
   `TiIsNotWord` tinyint(1) NOT NULL,
   PRIMARY KEY (`TiID`),
   KEY `TiLgID` (`TiLgID`),
   KEY `TiTxID` (`TiTxID`),
   KEY `TiSeID` (`TiSeID`),
   KEY `TiOrder` (`TiOrder`),
   KEY `TiTextLC` (`TiTextLC`),
   KEY `TiIsNotWord` (`TiIsNotWord`) ) ENGINE=MyISAM AUTO_INCREMENT=592738 DEFAULT CHARSET=utf8;
CREATE TABLE `texts` (
   `TxID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `TxLgID` int(11) unsigned NOT NULL,
   `TxTitle` varchar(200) NOT NULL,
   `TxText` text NOT NULL,
   `TxAnnotatedText` longtext NOT NULL,
   `TxAudioURI` varchar(200) DEFAULT NULL,
   `TxSourceURI` varchar(1000) DEFAULT NULL,
   PRIMARY KEY (`TxID`),
   KEY `TxLgID` (`TxLgID`) ) ENGINE=MyISAM AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
CREATE TABLE `texttags` (
   `TtTxID` int(11) unsigned NOT NULL,
   `TtT2ID` int(11) unsigned NOT NULL,
   PRIMARY KEY (`TtTxID`,`TtT2ID`),
   KEY `TtTxID` (`TtTxID`),
   KEY `TtT2ID` (`TtT2ID`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE TABLE `words` (
   `WoID` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `WoLgID` int(11) unsigned NOT NULL,
   `WoText` varchar(250) NOT NULL,
   `WoTextLC` varchar(250) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
   `WoStatus` tinyint(4) NOT NULL,
   `WoTranslation` varchar(500) NOT NULL DEFAULT '*',
   `WoRomanization` varchar(100) DEFAULT NULL,
   `WoSentence` varchar(1000) DEFAULT NULL,
   `WoCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `WoStatusChanged` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
   `WoTodayScore` double NOT NULL DEFAULT '0',
   `WoTomorrowScore` double NOT NULL DEFAULT '0',
   `WoRandom` double NOT NULL DEFAULT '0',
   PRIMARY KEY (`WoID`),
   UNIQUE KEY `WoLgIDTextLC` (`WoLgID`,`WoTextLC`),
   KEY `WoLgID` (`WoLgID`),
   KEY `WoStatus` (`WoStatus`),
   KEY `WoTextLC` (`WoTextLC`),
   KEY `WoTranslation` (`WoTranslation`(333)),
   KEY `WoCreated` (`WoCreated`),
   KEY `WoStatusChanged` (`WoStatusChanged`),
   KEY `WoTodayScore` (`WoTodayScore`),
   KEY `WoTomorrowScore` (`WoTomorrowScore`),
   KEY `WoRandom` (`WoRandom`) ) ENGINE=MyISAM AUTO_INCREMENT=19518 DEFAULT CHARSET=utf8;
CREATE TABLE `wordtags` (
   `WtWoID` int(11) unsigned NOT NULL,
   `WtTgID` int(11) unsigned NOT NULL,
   PRIMARY KEY (`WtWoID`,`WtTgID`),
   KEY `WtTgID` (`WtTgID`),
   KEY `WtWoID` (`WtWoID`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
