import { render, fireEvent, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  it('should display the correct message and buttons for type confirm', async () => {
    await render(ConfirmDialogComponent, {
      componentProperties: {
        message: '¿Estás seguro?',
        type: 'confirm'
      }
    });

    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should display the correct message and button for type info', async () => {
    await render(ConfirmDialogComponent, {
      componentProperties: {
        message: 'Operación completada',
        type: 'info'
      }
    });

    expect(screen.getByText('Operación completada')).toBeInTheDocument();
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
    expect(screen.queryByText('Cancelar')).toBeNull();
  });

  it('should emit confirm event when confirm button is clicked', async () => {
    const { fixture } = await render(ConfirmDialogComponent, {
      componentProperties: {
        message: '¿Confirmas la acción?',
        type: 'confirm'
      }
    });

    const confirmSpy = jest.spyOn(fixture.componentInstance.confirm, 'emit');
    fireEvent.click(screen.getByText('Confirmar'));
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', async () => {
    const { fixture } = await render(ConfirmDialogComponent, {
      componentProperties: {
        message: '¿Cancelar la acción?',
        type: 'confirm'
      }
    });

    const cancelSpy = jest.spyOn(fixture.componentInstance.cancel, 'emit');
    fireEvent.click(screen.getByText('Cancelar'));
    expect(cancelSpy).toHaveBeenCalled();
  });
});
