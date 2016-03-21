import ansiToBrowser from '../../src/ansi-to-browser';
import faker from 'faker';
import colors from 'chalk';

describe('ansiToBrowser', () => {
  it('converts individual colors', () => {
    const someText = faker.lorem.sentence();
    const args = ansiToBrowser(colors.red(someText));
    expect(args[0]).to.eql(`%c${ someText }`);
    expect(args[1]).to.include('color: red;').and.not.include('background-color').and.not.include('font-weight');
  });

  it('handles gray properly', () => {
    const someText = faker.lorem.sentence();
    const args = ansiToBrowser(colors.gray(someText));
    expect(args[0]).to.eql(`%c${ someText }`);
    expect(args[1]).to.include('color: gray;').and.not.include('background-color').and.not.include('font-weight');
  });

  it('converts multiple colors', () => {
    const someText = faker.lorem.sentence();
    const args = ansiToBrowser(colors.red.bgGreen(someText));
    expect(args[0]).to.eql(`%c${ someText }`);
    expect(args[1]).to.include('color: red;').and.include('background-color: green;');
  });

  it('resets properly', () => {
    const crazyText = faker.lorem.sentence();
    const normalText = faker.lorem.sentence();
    const ansiEncoded = colors.cyan.bgMagenta.bold.underline(crazyText) + normalText;
    const args = ansiToBrowser(ansiEncoded);
    expect(args[0]).to.eql(`%c${ crazyText }%c${ normalText }`);
    expect(args[2]).to.eql('');
  });

  it('converts multiple styles', () => {
    const greenText = faker.lorem.sentence();
    const redBackgroundText = faker.lorem.sentence();
    const ansiEncoded = colors.green(greenText) + colors.bgRed(redBackgroundText);
    const args = ansiToBrowser(ansiEncoded);
    expect(args[0]).to.eql(`%c${ greenText }%c${ redBackgroundText }`);
    expect(args[1]).to.include('color: green;').and.not.include('background-color');
    expect(args[2]).to.include('background-color: red;').and.not.include('green');
  });

  it('handles semicolons properly', () => {
    const text = faker.lorem.sentence();
    const first = `\u001b[1m\u001b[30m${ text }`;
    const second = `\u001b[1;30m${ text }`;
    expect(ansiToBrowser(first)).to.deep.eql(ansiToBrowser(second));
  });

  it('behaves properly with normal strings', () => {
    const text = faker.lorem.sentence();
    expect(ansiToBrowser(text)).to.deep.eql([text]);
  });
});
