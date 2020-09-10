import { mergeStates } from "./state";

describe('mergeStates', () => {
  describe('mergin loading', () => {
    it('returns true if at least one is true', () => {
      expect(mergeStates({
        a: {
          loading: true,
          error: null,
          data: null
        },
        b: {
          loading: false,
          error: null,
          data: null
        }
      })).toEqual({
        loading: true,
        error: null,
        data: {
          a: null,
          b: null
        }
      });
    });

    it('returns false if both are false', () => {
      expect(mergeStates({
        a: {
          loading: false,
          error: null,
          data: null
        },
        b: {
          loading: false,
          error: null,
          data: null
        }
      })).toEqual({
        loading: false,
        error: null,
        data: {
          a: null,
          b: null
        }
      });
    });
  });

  describe('merging errors', () => {
    it('returns null when all null', () => {
      expect(mergeStates({
        a: {
          loading: false,
          error: null,
          data: null
        },
        b: {
          loading: false,
          error: null,
          data: null
        }
      })).toEqual({
        loading: false,
        error: null,
        data: {
          a: null,
          b: null
        }
      });
    });
    it('returns error from not null object', () => {
      expect(mergeStates({
        a: {
          loading: false,
          error: {
            messages: ['Hello', 'Error']
          },
          data: null
        },
        b: {
          loading: false,
          error: null,
          data: null
        }
      })).toEqual({
        loading: false,
        error: {
          messages: ['Hello', 'Error']
        },
        data: {
          a: null,
          b: null
        }
      });
    });
    it('merges errors from both objects', () => {
      expect(mergeStates({
        a: {
          loading: false,
          error: {
            messages: ['Hello', 'Error']
          },
          data: null
        },
        b: {
          loading: false,
          error: {
            messages: ['Another', 'and one more']
          },
          data: null
        }
      })).toEqual({
        loading: false,
        error: {
          messages: ['Hello', 'Error', 'Another', 'and one more']
        },
        data: {
          a: null,
          b: null
        }
      });
    });
  });
  it('merges data', () => {
    expect(mergeStates({
      a: {
        loading: false,
        error: null,
        data: {
          hello: 5,
          aaa: 'bbb'
        }
      },
      b: {
        loading: false,
        error: null,
        data: {
          sth: {
            a: 'an obj'
          }
        }
      }
    })).toEqual({
      loading: false,
      error: null,
      data: {
        a: {
          hello: 5,
          aaa: 'bbb'
        },
        b: {
          sth: {
            a: 'an obj'
          }
        }
      }
    });
  });
});
