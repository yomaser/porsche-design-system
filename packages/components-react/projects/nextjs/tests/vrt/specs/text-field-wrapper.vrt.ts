import { defaultViewports, getVisualRegressionTester, vrtTest } from '@porsche-design-system/shared/testing';

it.each(defaultViewports)('should have no visual regression for viewport %s', async (viewport) => {
  expect(
    await vrtTest(getVisualRegressionTester(viewport), 'text-field-wrapper', '/text-field-wrapper', {
      javaScriptEnabled: false,
    })
  ).toBeFalsy();
});
