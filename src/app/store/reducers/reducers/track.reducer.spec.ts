import { trackReducer, initialState } from './track.reducer';

describe('Track Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = trackReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
