import { adjustSelectedFramework } from '../../src/utils/adjustSelectedFramework';
import store from '../../src/store';

jest.mock('../../src/store', () => ({
  ...jest.requireActual('../../src/store'),
  commit: jest.fn(),
  getters: {
    selectedFramework: 'angular',
  },
}));

it('should do nothing if selectedFramework exists in markup', () => {
  store.getters.selectedFramework = 'angular';
  const spy = jest.spyOn(store, 'commit');

  adjustSelectedFramework({ angular: '', react: '' });
  expect(spy).not.toBeCalled();

  store.getters.selectedFramework = 'react';
  adjustSelectedFramework({ angular: '', react: '' });
  expect(spy).not.toBeCalled();
});

it('should call store.commit() with first framework if selectedFramework does not exist in markup', () => {
  store.getters.selectedFramework = 'vanilla-js';
  const spy = jest.spyOn(store, 'commit');

  adjustSelectedFramework({ angular: '', react: '' });
  expect(spy).toBeCalledWith('setSelectedFramework', 'angular');

  adjustSelectedFramework({ react: '' });
  expect(spy).toBeCalledWith('setSelectedFramework', 'react');
});
