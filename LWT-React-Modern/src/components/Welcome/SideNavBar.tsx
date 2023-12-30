import { Tooltip, UnstyledButton, rem } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
import {
  IconBook,
  IconBook2,
  IconBookUpload,
  IconBooks,
  IconChartBar,
  IconChartBubble,
  IconCheck,
  IconDatabase,
  IconInfoCircle,
  IconSettings,
  IconTag,
  IconTags,
  IconWorld,
} from '@tabler/icons-react';
import { linkLayout } from 'lwt-ui-kit';
import { useState } from 'react';
import classes from './DoubleNavbar.module.css';
console.log('TEST123', linkLayout);
// TODO nested? so all text pages grouped, all word pages grouped, etc
export const linkIconLookup = {
  '/edit_texts': { icon: IconBook, color: 'violet' },
  '/edit_archivedtexts': { icon: IconBook2, color: 'violet' },
  '/edit_texttags': { icon: IconTag, color: 'violet' },
  '/edit_languages': { icon: IconWorld, color: 'green' },
  '/edit_words': { icon: IconChartBubble, color: 'cyan' },
  '/edit_tags': { icon: IconTags, color: 'cyan' },
  '/statistics': { icon: IconChartBar, color: 'orange' },
  '/check_text': { icon: IconCheck, color: 'violet' },
  '/long_text_import': { icon: IconBooks, color: 'violet' },
  '/upload_words': { icon: IconBookUpload, color: 'cyan' },
  '/backup_restore': { icon: IconDatabase, color: 'orange' },
  '/settings': { icon: IconSettings, color: 'orange' },
  '/info': { icon: IconInfoCircle, color: 'orange' },
};
export const mainLinksMockdata = linkLayout
  .filter((val) => val !== null)
  .map((val) => ({ ...val, ...linkIconLookup[val.link] }));
// [
// { icon: IconHome2, label: 'Home' },
// { icon: IconGauge, label: 'Dashboard' },
// { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
// { icon: IconCalendarStats, label: 'Releases' },
// { icon: IconUser, label: 'Account' },
// { icon: IconFingerprint, label: 'Security' },
// { icon: IconSettings, label: 'Settings' },
// ];

export function DoubleNavbar() {
  const [active, setActive] = useState('Releases');
  const [activeLink, setActiveLink] = useState('Settings');

  const mainLinks = mainLinksMockdata.map((link) => {
    const Icon = linkIconLookup[link.link].icon;
    return (
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton
          onClick={() => setActive(link.label)}
          className={classes.mainLink}
          data-active={link.label === active || undefined}
        >
          <Icon
            // style={{ width: rem(22), height: rem(22), color: linkIconLookup[link.link].color }}
            style={{ width: rem(22), height: rem(22), color: 'cyan' }}
            stroke={1.5}
          />
        </UnstyledButton>
      </Tooltip>
    );
  });

  // const links = mainLinksMockdata.map(({ label: link }) => (
  //   <a
  //     className={classes.link}
  //     data-active={activeLink === link || undefined}
  //     href="#"
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActiveLink(link);
  //     }}
  //     key={link}
  //   >
  //     {link}
  //   </a>
  // ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}></div>
          {mainLinks}
        </div>
        {/* <div className={classes.main}> */}
        {/* <Title order={4} className={classes.title}>
            {active}
          </Title> */}

        {/* {links} */}
        {/* </div> */}
      </div>
    </nav>
  );
}
