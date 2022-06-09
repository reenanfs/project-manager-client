import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';

import StandardDialog from 'components/dialogs/StandardDialog';
import AddPersonForm from 'pages/people/components/forms/AddPersonForm';
import { PEOPLE_FORM_ID } from 'pages/people/peopleConstants';
import { CREATE_USER, GET_USERS } from 'pages/people/peopleQueries';
import { IPersonFields, Person } from 'pages/people/peopleTypes';

interface IAddPersonDialogProps {
  open: boolean;
  title: string;
  handleClose: () => void;
  handleConfirm?: () => void;
}

const AddPersonDialog = ({
  open,
  title,
  handleClose,
}: IAddPersonDialogProps): JSX.Element => {
  const [createUser, { loading, error }] = useMutation<
    { createUser: Person },
    { input: IPersonFields }
  >(CREATE_USER, {
    refetchQueries: [GET_USERS, 'GetUsers'],
  });

  const onSubmit: SubmitHandler<IPersonFields> = async ({
    name,
    role,
    email,
  }): Promise<void> => {
    await createUser({
      variables: {
        input: {
          name,
          role,
          email,
        },
      },
    });
    handleClose();
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return (
    <StandardDialog
      open={open}
      title={title}
      content={<AddPersonForm onSubmit={onSubmit} />}
      contentFormId={PEOPLE_FORM_ID}
      confirmButtonLoading={loading}
      handleClose={handleClose}
    />
  );
};

export default AddPersonDialog;
