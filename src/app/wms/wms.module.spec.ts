import { WmsModule } from './wms.module';

describe('WmsModule', () => {
  let wmsModule: WmsModule;

  beforeEach(() => {
    wmsModule = new WmsModule();
  });

  it('should create an instance', () => {
    expect(wmsModule).toBeTruthy();
  });
});
