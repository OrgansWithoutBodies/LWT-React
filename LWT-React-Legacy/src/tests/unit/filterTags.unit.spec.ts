import { Tags2ID, TextTag } from 'lwt-schemas';
import { filterTags } from '../../renderer/src/utils/filterTags';

describe('filterTags', () => {
  // TODO use data from demo db
  const testData: TextTag[] = [
    { TtTxID: 1, TtT2ID: 1 },
    { TtTxID: 1, TtT2ID: 2 },
    { TtTxID: 1, TtT2ID: 3 },
    { TtTxID: 2, TtT2ID: 1 },
    { TtTxID: 2, TtT2ID: 3 },
    { TtTxID: 3, TtT2ID: 2 },
  ] as TextTag[];
  it('Accounts for when no tags are specified', () => {
    const filteredDataOR = filterTags({
      tagIDs: testData,
      tag1: null,
      tag2: null,
      tag12: 0,
    });

    const filteredDataAND = filterTags({
      tagIDs: testData,
      tag1: null,
      tag2: null,
      tag12: 1,
    });

    expect(filteredDataOR).toEqual({ 1: true, 2: true, 3: true });
    expect(filteredDataAND).toEqual({ 1: true, 2: true, 3: true });
  });
  it('Accounts for when one tag is specified', () => {
    const filteredDataLeftOR = filterTags({
      tagIDs: testData,
      tag1: 1 as Tags2ID,
      tag2: null,
      tag12: 0,
    });

    const filteredDataLeftAND = filterTags({
      tagIDs: testData,
      tag1: 2 as Tags2ID,
      tag2: null,
      tag12: 1,
    });

    const filteredDataRightOR = filterTags({
      tagIDs: testData,
      tag1: null,
      tag2: 1 as Tags2ID,
      tag12: 0,
    });

    const filteredDataRightAND = filterTags({
      tagIDs: testData,
      tag1: null,
      tag2: 2 as Tags2ID,
      tag12: 1,
    });

    expect(filteredDataLeftOR).toEqual({ 1: true, 2: true });
    expect(filteredDataLeftAND).toEqual({ 1: true, 3: true });
    expect(filteredDataRightOR).toEqual({ 1: true, 2: true });
    expect(filteredDataRightAND).toEqual({ 1: true, 3: true });
  });
  it('Accounts for when multiple tags are specified', () => {
    const filteredDataOR = filterTags({
      tagIDs: testData,
      tag1: 1 as Tags2ID,
      tag2: 2 as Tags2ID,
      tag12: 0,
    });

    const filteredDataAND = filterTags({
      tagIDs: testData,
      tag1: 1 as Tags2ID,
      tag2: 2 as Tags2ID,
      tag12: 1,
    });

    expect(filteredDataOR).toEqual({ 1: true, 2: true, 3: true });
    expect(filteredDataAND).toEqual({ 1: true, 2: 'partial', 3: 'partial' });
  });
});
