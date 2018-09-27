import * as React from 'react';

interface LocalDraftTypes {
  drafts: any[];
}

export default class extends React.Component<void, LocalDraftTypes> {
  state = {
    drafts: []
  };

  searchLocalStorage = () => {
    return localStorage.forEach(
      (item, iterator) => localStorage.key(iterator).includes('Draft') && item
    );
  };

  componentDidMount() {
    let storage = this.searchLocalStorage();

    return storage.forEach(item => item);
  }

  render() {
    return <span>I should be a list and i'm not</span>;
  }
}
