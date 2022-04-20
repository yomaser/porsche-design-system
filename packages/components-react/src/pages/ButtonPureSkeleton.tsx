/* Auto Generated File */
import { PButtonPure } from '@porsche-design-system/components-react';
import { useEffect } from 'react';
import { pollComponentsReady } from '../pollComponentsReady'

export const ButtonPureSkeletonPage = (): JSX.Element => {
  useEffect(() => {
    pollComponentsReady().then(() => {
      document.querySelectorAll('p-button-pure').forEach((button) => {
        button.classList.remove('hydrated');
      });
    });
  }, []);

  return (
    <>
      <div className="playground light" title="should render button skeleton">
        <PButtonPure>Some label</PButtonPure>
      </div>
      <div className="playground dark" title="should render button skeleton on dark theme">
        <PButtonPure theme="dark">Some label</PButtonPure>
      </div>

      <div className="playground light" title="should render button skeleton without label">
        <PButtonPure hideLabel={true}>Some label</PButtonPure>
      </div>
      <div className="playground dark" title="should render button skeleton without label on dark theme">
        <PButtonPure hideLabel={true} theme="dark">Some label</PButtonPure>
      </div>

      <div className="playground light" title="should render button skeleton with multiline label">
        <PButtonPure style={{ width: '240px' }}>Lorem ipsum dolor sit amet, consetetur sadipscing</PButtonPure>
      </div>
    </>
  );
};
