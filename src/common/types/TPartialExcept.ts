type TPartialExcept<Type, Property extends keyof Type> = Partial<Type> &
  Pick<Type, Property>;

export default TPartialExcept;
