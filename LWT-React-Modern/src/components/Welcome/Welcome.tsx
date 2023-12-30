import {
  Anchor,
  Card,
  Checkbox,
  Group,
  Select,
  SimpleGrid,
  Table,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import cx from 'clsx';
import { DoubleNavbar, mainLinksMockdata } from './SideNavBar';
import classes from './Welcome.module.css';

import { IconBook, IconPrinter, IconQuestionMark } from '@tabler/icons-react';
import { useData } from 'lwt-state';
import { TableSelection, TableSingleSelection } from './Table';
export function Welcome() {
  return (
    <>
      <DoubleNavbar />
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to <br />
        <Text inherit component="span">
          LWT-
          <Text
            variant="gradient"
            component="span"
            gradient={{ from: 'pink', to: 'yellow' }}
            inherit
          >
            Phoenix
          </Text>
        </Text>
      </Title>
      <ActionsGrid />
      <WordTable />
      <MantineLanguageDropdown />
      {<LastText />}
    </>
  );
}
function LastText() {
  const [{ activeText: currentText, languageOfActiveText }] = useData([
    'activeText',
    'languageOfActiveText',
  ]);
  return (
    <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
      My last text in {languageOfActiveText && languageOfActiveText.LgName}:
      {currentText && (
        <>
          {' '}
          <br /> <i>{currentText.TxTitle}</i>
          <br />
          <Anchor href={`/do_text?start=${currentText.TxID}`}>
            <IconBook />
            &nbsp;Read
          </Anchor>
          &nbsp; &nbsp;
          <Anchor href={`/do_test?text=${currentText.TxID}`}>
            {/* <Icon src="question-balloon" title="Test" /> */}
            <IconQuestionMark />
            &nbsp;Test
          </Anchor>
          &nbsp; &nbsp;
          <Anchor href={`/print_text?text=${currentText.TxID}`}>
            {/* <Icon src="printer" title="Print" /> */}
            <IconPrinter />
            &nbsp;Print
          </Anchor>
          {currentText.TxAnnotatedText.length > 0 && (
            <>
              &nbsp; &nbsp;
              <Anchor href={`/print_impr_text?text=${currentText.TxID}`}>
                {/* <Icon src="tick" title="Improved Annotated Text" /> */}
                <IconBook />
                &nbsp;Ann. Text
              </Anchor>
            </>
          )}
        </>
      )}
      {/* <Anchor href="https://mantine.dev/guides/vite/" size="lg"> */}
    </Text>
  );
}

function MantineLanguageDropdown() {
  const [{ languages }] = useData(['languages']);

  return (
    <Select
      ta="center"
      size="lg"
      maw={580}
      mx="auto"
      mt="xl"
      label="Active Language"
      placeholder="Choose..."
      data={languages.map((val) => val.LgName)}
    />
  );
}

export function ActionsGrid() {
  const theme = useMantineTheme();
  console.log(mainLinksMockdata);
  const items = [...mainLinksMockdata]
    .sort((a, b) => (a.color > b.color ? 1 : -1))
    .map((item) => (
      <UnstyledButton key={item.label} className={classes.item}>
        <item.icon color={theme.colors[item.color][6]} size="2rem" />
        <Text size="xs" mt={7}>
          {item.label}
        </Text>
      </UnstyledButton>
    ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>Pages</Text>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
export function WordTable() {
  const [{ words }] = useData(['words']);
  return (
    <TableSelection<{ id: string; WoText: string; WoTranslation: string }>
      data={words.map((val) => ({ ...val, id: val.WoID }))}
      RowTemplate={({ selected, id, toggleRow, WoText: WoTerm, WoTranslation }) => {
        return (
          <>
            <Table.Tr key={id} className={cx({ [classes.rowSelected]: selected })}>
              <Table.Td>
                <Checkbox checked={selected} onChange={() => toggleRow(id)} />
              </Table.Td>
              <Table.Td>
                <Group gap="sm">
                  {/* <Avatar size={26} src={item.avatar} radius={26} /> */}
                  <Text size="sm" fw={500}>
                    {WoTerm}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>{WoTranslation}</Table.Td>
              {/* <Table.Td>{item.job}</Table.Td> */}
            </Table.Tr>
          </>
        );
      }}
      headerVals={['Term', 'Translation']}
    />
  );
}
export function LanguageTable() {
  const [{ languages }] = useData(['languages']);
  return (
    <TableSingleSelection
      data={[]}
      RowTemplate={function (val: { id: string } & { selected: boolean }): JSX.Element {
        throw new Error('Function not implemented.');
      }}
      headerVals={[]}
    />
  );
}
