import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PurchaseAirtelDataDto } from './dtos/create-airtime.dto';
import axios from 'axios';
import { WalletService } from 'src/wallet/wallet.service';
import { ConfigType } from '@nestjs/config';
import { vtPassConfig } from './config/vtPassConfig';

@Injectable()
export class VtpassService {
  constructor(
    private readonly walletService: WalletService,

    @Inject(vtPassConfig.KEY)
    private readonly vtPassCofig: ConfigType<typeof vtPassConfig>,
  ) {}
  public async purchaseAirtelData(
    purchaseDataDto: PurchaseAirtelDataDto,
    userEmail: string,
  ): Promise<any> {
    // validate wallet for the user
    const hasBalance = await this.walletService.validateUserWallet(
      userEmail,
      purchaseDataDto.amount,
    );

    if (!hasBalance) throw new BadRequestException(`Insufficient Balance`);

    // check if the user has enough balance to make this transaction
    const data = await axios.post(
      'https://sandbox.vtpass.com/api/pay',
      {
        ...purchaseDataDto,
        request_id: `${new Date().getTime()}${Math.floor(Math.random() * 1000)}`,
      },
      {
        headers: {
          'api-key': this.vtPassCofig.apiKey,
          'content-type': 'application/json',
          'secret-key': this.vtPassCofig.secretKey,
        },
      },
    );
    console.log(data.data);

    if (data.data.response_description != 'TRANSACTION SUCCESSFUL') {
      throw new BadRequestException(data.data.response_description);
    }
    if (
      data.status === 200 &&
      data.data.response_description === 'TRANSACTION SUCCESSFUL'
    ) {
      await this.walletService.withdrawFromWallet(userEmail, data.data?.amount);
    }
    // deduct from the wallet
    // do this in a transactional way
    // update the transaction table with the response from vtpass
    console.log(data);

    return {
      success: true,
    };
  }
}
