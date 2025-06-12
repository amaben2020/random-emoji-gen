import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class UnitOfWorkService {
  private queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    await this.queryRunner.release();
  }

  getManager() {
    return this.queryRunner.manager;
  }

  //Stateless: A safer pattern is to avoid mutable state like this.queryRunner altogether:
  async runInTransaction<T>(
    work: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  //USAGE: No need to manage commit, rollback and release states (Stateless)
  // await unitOfWorkService.runInTransaction(async (manager) => {
  //   await this.walletService.updateWalletBalance(email, amount, manager);
  // });
}
