import Swal from 'sweetalert2/dist/sweetalert2.js';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export function showDeleteUserConfirm(onConfirm: () => void) {
  MySwal.fire({
    title: 'Are you sure?',
    text: 'This action will permanently delete the user.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete user!'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}

export function showSuccess(message: string) {
  MySwal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    timer: 2000,
    showConfirmButton: false
  });
}

export function showError(message: string) {
  MySwal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    timer: 2500,
    showConfirmButton: false
  });
}
