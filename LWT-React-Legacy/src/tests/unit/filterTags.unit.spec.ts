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
    const filteredDataOR = filterTags(testData, null, null, 0);

    const filteredDataAND = filterTags(testData, null, null, 1);

    expect(filteredDataOR).toEqual({ 1: true, 2: true, 3: true });
    expect(filteredDataAND).toEqual({ 1: true, 2: true, 3: true });
  });
  it('Accounts for when one tag is specified', () => {
    const filteredDataLeftOR = filterTags(testData, 1 as Tags2ID, null, 0);

    const filteredDataLeftAND = filterTags(testData, 2 as Tags2ID, null, 1);

    const filteredDataRightOR = filterTags(testData, null, 1 as Tags2ID, 0);

    const filteredDataRightAND = filterTags(testData, null, 2 as Tags2ID, 1);

    expect(filteredDataLeftOR).toEqual({ 1: true, 2: true });
    expect(filteredDataLeftAND).toEqual({ 1: true, 3: true });
    expect(filteredDataRightOR).toEqual({ 1: true, 2: true });
    expect(filteredDataRightAND).toEqual({ 1: true, 3: true });
  });
  it('Accounts for when multiple tags are specified', () => {
    const filteredDataOR = filterTags(testData, 1 as Tags2ID, 2 as Tags2ID, 0);

    const filteredDataAND = filterTags(testData, 1 as Tags2ID, 2 as Tags2ID, 1);

    expect(filteredDataOR).toEqual({ 1: true, 2: true, 3: true });
    expect(filteredDataAND).toEqual({ 1: true, 2: 'partial', 3: 'partial' });
  });
});
