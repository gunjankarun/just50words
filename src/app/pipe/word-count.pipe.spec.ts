import { WordCountPipe } from './word-count.pipe';

describe('WordCountPipe', () => {
  it('create an instance', () => {
    const pipe = new WordCountPipe();
    expect(pipe).toBeTruthy();
  });
});
