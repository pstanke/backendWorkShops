import { AdForm } from '../../features/AdForm/AdForm';

export const AddAd = () => {
  return (
    <AdForm method={'POST'} URL={'/ads'} actionText={'Add advertisement'} />
  );
};
