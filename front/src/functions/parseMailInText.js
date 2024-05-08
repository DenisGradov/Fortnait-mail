function parseMailInText(text) {
  const regex = /^([^\s@]+)@([^\s@]+\.[^\s@:]+):(.+)$/;
  const match = text.match(regex);
  if (match) {
    return {
      login: match[1],
      domain: match[2],
      password: match[3],
      email: `${match[1]}@${match[2]}`,
    };
  } else return false;
}

export default parseMailInText;
