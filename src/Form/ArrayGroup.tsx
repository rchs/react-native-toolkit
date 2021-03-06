/* global __DEV__ */

import React from 'react';
import useFormInput from './useFormInput';
import Editor, { useEditor } from './Editor';

type Props = {
  name: string,
  onSubmit: ((v: []) => void),
};

export default function ArrayGroup({ name, onSubmit, ...other }: Props) {
  const [value, onChange] = useFormInput(name, []);
  const parent = useEditor();

  if (__DEV__) {
    if (!Array.isArray(value)) {
      // eslint-disable-next-line no-console
      console.warn(`A value of type array is expected for form elmeent named ${name} but got ${typeof value}`);
    }
  }

  return (
    <Editor
      {...other}
      value={value}
      parent={parent}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
